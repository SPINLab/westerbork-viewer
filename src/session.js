let sessionUuid;
const sessionStart = new Date();

async function newSession() {
  const response = await fetch('http://localhost:3000/v1/sessions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      onPremise: process.env.VUE_APP_MODE === 'onpremise',
    }),
  });
  const { id } = await response.json();
  sessionUuid = id;
}

export function getSessionUuid() {
  return sessionUuid;
}

export function getSessionTime() {
  return (new Date() - sessionStart) / 1000;
}

newSession();
