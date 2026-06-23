const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:5000/api').replace(
  /\/$/,
  '',
)

export interface CreateJobApplicationPayload {
  fullName: string
  phone: string
  email: string
  position: string
  cvUrl?: string
  cvFileName?: string
  message?: string
}

interface JobApplicationResponse {
  success: boolean
  message: string
  id: number
}

export async function createJobApplication(
  payload: CreateJobApplicationPayload,
): Promise<JobApplicationResponse> {
  const response = await fetch(`${API_BASE_URL}/job-applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }

  return response.json() as Promise<JobApplicationResponse>
}

export async function uploadCv(file: File): Promise<{ url: string; fileName: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/upload/image`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed with status ${response.status}`)
  }

  const data = (await response.json()) as { url: string; fileName: string }
  return data
}
