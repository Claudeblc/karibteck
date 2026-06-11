# Déploiement (CI/CD)

Le site est un build **Astro statique** déployé sur un **VPS nginx**.
Le déploiement est automatisé par GitHub Actions : [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

## Déclenchement

- À chaque **merge sur `main`** (push).
- Manuellement via **Actions → Deploy to VPS → Run workflow** (`workflow_dispatch`).

Le job `build` sert aussi de garde-fou : un build cassé n'atteint jamais la prod.

## ⚠️ Aucun secret dans le dépôt

Le repo est **public**. **Aucune** donnée serveur (clé SSH, IP, utilisateur, chemin, clé d'API)
n'est commitée. Tout est lu depuis **GitHub Secrets** au moment de l'exécution.

- `.env` et `.env.production` sont dans `.gitignore` — ne jamais les pousser.
- Le workflow ne référence que `${{ secrets.* }}`, jamais de valeur en dur.

## Secrets à configurer

`Settings → Secrets and variables → Actions → New repository secret`

| Secret                | Rôle                                                            |
| --------------------- | --------------------------------------------------------------- |
| `VPS_SSH_PRIVATE_KEY` | Clé **privée** SSH de déploiement (idéalement dédiée).          |
| `VPS_KNOWN_HOSTS`     | Empreinte SSH du serveur (`ssh-keyscan -t ed25519,rsa <hôte>`). |
| `VPS_HOST`            | Hôte du VPS (IP ou domaine).                                    |
| `VPS_USER`            | Utilisateur SSH de déploiement.                                 |
| `VPS_DEPLOY_PATH`     | Racine web servie par nginx (doit être sous `/var/www`).        |

PUBLIC\_\* (optionnels — le site build sans eux ; ils activent formulaire / Cal / WhatsApp) :

| Secret                    | Variable d'env injectée au build |
| ------------------------- | -------------------------------- |
| `PUBLIC_WEB3FORMS_KEY`    | clé publique Web3Forms           |
| `PUBLIC_CALCOM_URL`       | URL de réservation Cal.com       |
| `PUBLIC_WHATSAPP_NUMBER`  | numéro WhatsApp (format intl.)   |
| `PUBLIC_PLAUSIBLE_DOMAIN` | domaine Plausible (analytics)    |

## Recommandation : clé de déploiement dédiée

Plutôt que de réutiliser une clé personnelle, générer une paire dédiée à la CI :

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_key -N ""
# Ajouter deploy_key.pub à ~/.ssh/authorized_keys sur le VPS (idéalement un user limité au déploiement)
# Coller le contenu de deploy_key (clé privée) dans le secret VPS_SSH_PRIVATE_KEY
```

## Sécurité du transfert

- `rsync --delete` synchronise `dist/` avec la racine web (miroir exact).
- `--exclude='.well-known/'` préserve les challenges ACME (renouvellement Let's Encrypt).
- `--delay-updates` rend le basculement quasi atomique.
- Garde-fou : le job refuse de tourner si `VPS_DEPLOY_PATH` est vide ou hors `/var/www`.
- La clé privée est écrite en `0600` puis **supprimée** en fin de job (`if: always()`).
