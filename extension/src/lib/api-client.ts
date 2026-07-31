const API_BASE = 'http://localhost:8000/api/v1';

export async function postBatch(endpoint: string, body: unknown): Promise<Response> {
  const state = await chrome.storage.local.get('tabtrail_state');
  const baseUrl = state?.tabtrail_state?.backendUrl || API_BASE;
  const url = `${baseUrl}${endpoint}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`API error ${response.status}: ${response.statusText}`);
  }

  return response;
}

export async function postActivities(userId: string, clientId: string, activities: unknown[]): Promise<boolean> {
  try {
    await postBatch('/activities/batch', { userId, clientId, activities });
    return true;
  } catch {
    return false;
  }
}

export async function postScreenshots(userId: string, clientId: string, screenshots: unknown[]): Promise<boolean> {
  try {
    await postBatch('/screenshots/batch', { userId, clientId, screenshots });
    return true;
  } catch {
    return false;
  }
}