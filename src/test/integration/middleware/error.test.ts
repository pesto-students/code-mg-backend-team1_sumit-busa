import app from '@/app'
import request from 'supertest'

describe('error middleware', () => {
  it('throws 404 error when invalid path is given', async () => {
    const response = await request(app).get('/not-found')
    expect(response.statusCode).toBe(404)
    expect(response.body.code).toBe(404)
  })

  it('trows 500 error for unhandled exception', async () => {
    const response = await request(app).get('/error')

    expect(response.statusCode).toBe(500)
    expect(response.body.code).toBe(500)
  })
})
