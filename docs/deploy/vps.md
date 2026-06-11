# Déploiement VPS — mise en route (à compléter)

> ⏸️ **Standby.** Le workflow [`.github/workflows/deploy.yml`](../../.github/workflows/deploy.yml)
> est prêt mais inactif tant que la variable `DEPLOY_ENABLED` n'est pas mise à `true`.
> Ce document liste tout ce qui reste à brancher côté VPS et côté GitHub.

## Vue d'ensemble

```
push main ─► GitHub Actions ─► npm ci ─► npm run build ─► validate:jsonld
                                              │
                                              └─► rsync dist/ ──ssh──► VPS:/var/www/karibteck
                                                                          │
                                                                          └─► nginx sert les fichiers statiques (TLS Let's Encrypt)
```

Build statique pur (`output: 'static'`) → on ne déploie que le contenu de `dist/`.

---

## 1. Préparer le VPS

```bash
# Utilisateur de déploiement dédié (non-root)
sudo adduser --disabled-password --gecos "" deploy

# Dossier servi par nginx
sudo mkdir -p /var/www/karibteck
sudo chown -R deploy:deploy /var/www/karibteck
```

### Clé SSH de déploiement

Sur une machine locale (pas sur le VPS), générer une paire **dédiée à la CI** :

```bash
ssh-keygen -t ed25519 -C "github-actions-karibteck" -f deploy_key -N ""
```

- Ajouter la **clé publique** (`deploy_key.pub`) au VPS :
  ```bash
  ssh-copy-id -i deploy_key.pub deploy@VOTRE_VPS
  # ou : cat deploy_key.pub >> ~deploy/.ssh/authorized_keys côté VPS
  ```
- La **clé privée** (`deploy_key`) ira dans le secret GitHub `VPS_SSH_KEY` (voir §3).

### known_hosts (anti-MITM)

Récupérer l'empreinte du VPS pour épingler l'hôte :

```bash
ssh-keyscan -p 22 VOTRE_VPS
```

Coller la sortie dans le secret GitHub `VPS_KNOWN_HOSTS`.

---

## 2. nginx

Exemple de vhost fourni dans [`nginx/karibteck.conf`](./nginx/karibteck.conf).

```bash
sudo cp nginx/karibteck.conf /etc/nginx/sites-available/karibteck.conf
sudo ln -s /etc/nginx/sites-available/karibteck.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx

# TLS
sudo certbot --nginx -d karibteck.com -d www.karibteck.com
```

---

## 3. Configurer GitHub (Settings → Secrets and variables → Actions)

### Secrets (chiffrés)

| Secret                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `VPS_SSH_KEY`          | Clé privée SSH de déploiement (`deploy_key`) |
| `VPS_KNOWN_HOSTS`      | Sortie de `ssh-keyscan` du VPS               |
| `PUBLIC_WEB3FORMS_KEY` | Clé Web3Forms (build) — optionnel            |

### Variables (non sensibles)

| Variable                  | Exemple                          | Description                           |
| ------------------------- | -------------------------------- | ------------------------------------- |
| `DEPLOY_ENABLED`          | `true`                           | **Active le déploiement** (garde-fou) |
| `VPS_HOST`                | `123.45.67.89` / `karibteck.com` | Hôte SSH                              |
| `VPS_USER`                | `deploy`                         | Utilisateur SSH                       |
| `VPS_PATH`                | `/var/www/karibteck`             | Dossier servi par nginx               |
| `VPS_PORT`                | `22`                             | Port SSH (optionnel, défaut 22)       |
| `PUBLIC_CALCOM_URL`       | …                                | Build (optionnel)                     |
| `PUBLIC_WHATSAPP_NUMBER`  | …                                | Build (optionnel)                     |
| `PUBLIC_PLAUSIBLE_DOMAIN` | `karibteck.com`                  | Build (optionnel)                     |

> Tant que `DEPLOY_ENABLED` ≠ `true`, le job `deploy` est **skippé** : la CI reste verte
> et rien n'est publié.

---

## 4. Activer

1. Renseigner les secrets/variables ci-dessus.
2. Mettre `DEPLOY_ENABLED` = `true`.
3. Lancer manuellement via **Actions → Deploy → Run workflow**, ou pousser sur `main`.

---

## Checklist d'activation

```
□ Utilisateur deploy + /var/www/karibteck créés sur le VPS
□ Clé SSH dédiée générée, publique sur le VPS, privée dans VPS_SSH_KEY
□ VPS_KNOWN_HOSTS rempli (ssh-keyscan)
□ vhost nginx installé + reload OK
□ TLS Let's Encrypt obtenu (certbot)
□ Variables VPS_HOST / VPS_USER / VPS_PATH renseignées
□ DEPLOY_ENABLED = true
□ Premier déploiement manuel vert (Run workflow)
□ https://karibteck.com sert bien le build
```
