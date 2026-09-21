import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function getStorePath() {
  return process.env.VERCEL
    ? '/tmp/mfd-store.json'
    : path.join(__dirname, '../data/store.json');
}

function readPersistedStore() {
  try {
    const storePath = getStorePath();
    if (!fs.existsSync(storePath)) {
      return { users: [], credentials: {} };
    }

    const parsed = JSON.parse(fs.readFileSync(storePath, 'utf8'));
    return {
      users: Array.isArray(parsed.users) ? parsed.users : [],
      credentials:
        parsed.credentials && typeof parsed.credentials === 'object'
          ? parsed.credentials
          : {},
    };
  } catch (err) {
    console.warn('[store] Failed to read persisted accounts:', err.message);
    return { users: [], credentials: {} };
  }
}

function writePersistedStore(users, credentials) {
  try {
    const storePath = getStorePath();
    const dir = path.dirname(storePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(
      storePath,
      JSON.stringify({ users, credentials }, null, 2),
      'utf8'
    );
  } catch (err) {
    console.warn('[store] Failed to persist accounts:', err.message);
  }
}

export function createAccountStore(seedUsers, seedCredentials) {
  const seedEmails = new Set(seedUsers.map((user) => user.email));

  function mergeState() {
    const persisted = readPersistedStore();
    const usersByEmail = new Map(seedUsers.map((user) => [user.email, user]));
    for (const user of persisted.users) {
      usersByEmail.set(user.email, user);
    }

    return {
      users: Array.from(usersByEmail.values()),
      credentials: { ...seedCredentials, ...persisted.credentials },
    };
  }

  let state = mergeState();

  function refresh() {
    state = mergeState();
    return state;
  }

  function registerUser(user, password) {
    refresh();
    state.users = state.users.filter((entry) => entry.email !== user.email);
    state.users.push(user);
    state.credentials[user.email] = { password, userId: user.id };

    const registeredUsers = state.users.filter((entry) => !seedEmails.has(entry.email));
    const registeredCredentials = Object.fromEntries(
      Object.entries(state.credentials).filter(([email]) => !seedEmails.has(email))
    );

    writePersistedStore(registeredUsers, registeredCredentials);
    return state;
  }

  function findCredentials(email) {
    refresh();
    return state.credentials[email] ?? null;
  }

  function findUserById(userId) {
    refresh();
    return state.users.find((user) => user.id === userId) ?? null;
  }

  function getUsers() {
    refresh();
    return state.users;
  }

  return {
    refresh,
    registerUser,
    findCredentials,
    findUserById,
    getUsers,
  };
}
