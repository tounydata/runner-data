# Vorcelab

App mobile React Native / Expo — portage de runner-data.

## Lancer sur iPhone (3 étapes)

### 1. Ouvrir un Codespace

Sur cette page GitHub : **Code → Codespaces → Create codespace on this branch**

> `npm install` se lance automatiquement à l'ouverture.

### 2. Démarrer l'app

Dans le terminal du Codespace :

```bash
bash start.sh
```

### 3. Scanner le QR code

Ouvre **Expo Go** sur ton iPhone → **Scan QR code** → scanne le QR dans le terminal.

---

## Connecter Strava

Au premier lancement, appuie sur **Connecter Strava**.
Dans les logs du terminal tu verras :

```
[Strava OAuth] redirect_uri = exp://u.expo.dev/...
```

Copie cette URL et ajoute-la dans tes [paramètres Strava API](https://www.strava.com/settings/api) → **Authorization Callback Domain** (mets juste `u.expo.dev`).

Ensuite retente le bouton → l'OAuth s'ouvre, tu autorises, et ça revient automatiquement dans l'app.

---

## Stack

- Expo SDK 52 + Expo Router (tabs)
- Supabase (auth + DB)
- Strava OAuth via expo-auth-session
- Zustand (state)
