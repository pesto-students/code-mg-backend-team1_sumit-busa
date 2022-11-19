import { COMPILER_API } from '@/config/config'
import axios from 'axios'

export const Language = {
  C: 50,
  'C++': 54,
  'Java (OpenJDK 13.0.1)': 62,
  'Go (1.13.5)': 60,
  'C# (Mono 6.6.0.161)': 51,
  'JavaScript (Node.js 12.14.0)': 63,
  'Plain Text': 43,
  'Python (2.7.17)': 70,
  'Python (3.8.1)': 71,
  'R (4.0.0)': 80,
  'TypeScript (3.7.4)': 74,
  'SQL (SQLite 3.27.2)': 82,
} as const

export const Status = {
  processing: { id: 2, description: 'Processing' },
  success: { id: 3, description: 'Accepted' },
  tle: { id: 5, description: 'Time Limit Exceeded' },
  wrongAnswer: { id: 4, description: 'Wrong Answer' },
  accepted: { id: 3, description: 'Accepted' },
  queue: { id: 1, description: 'In Queue' },
} as const

export type Response = {
  status: typeof Status[keyof typeof Status]
  compile_output: string
  message: string
  stdout: string
  stderr: string
}

export const compile = async (
  source_code: string,
  language: keyof typeof Language,
  expected_output: string = null,
  stdin: string = null,
) => {
  const language_id = Language[language]
  console.log('uploading')

  const {
    data: { token },
  } = await axios.post<{ token: string }>(`${COMPILER_API}/submissions`, {
    source_code,
    language_id,
    expected_output,
    stdin,
  })

  const result = await fetchResult(token)
  return result
}

const fetchResult = (token: string) =>
  new Promise<Response>((resolve, reject) => {
    const timer = setInterval(async () => {
      try {
        const { data } = await axios.get<Response>(`${COMPILER_API}/submissions/${token}?base64_encoded=true`)
        if (data.status.id !== Status.queue.id) {
          clearInterval(timer)
          data.compile_output = decode(data.compile_output)
          data.message = decode(data.message)
          data.stdout = decode(data.stdout)
          data.stderr = decode(data.stderr)
          resolve(data)
        }
      } catch (ex) {
        console.log('error occured')
        clearInterval(timer)
        reject(ex)
      }
    }, 2000)

    setTimeout(() => {
      clearInterval(timer)
      resolve({ status: Status.tle, compile_output: '', message: '', stdout: '', stderr: '' })
    }, 20000)
  })

function decode(bytes) {
  const escaped = escape(atob(bytes || ''))
  try {
    return decodeURIComponent(escaped)
  } catch {
    return unescape(escaped)
  }
}
