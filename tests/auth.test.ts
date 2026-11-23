import { describe, it, expect } from "vitest"
import { GET as GETMagicLink, POST } from "../app/api/auth/magic-link/route"
import { POST as POSTReset } from "../app/api/auth/password-reset/route"

describe("Auth API Routes", () => {
  describe("Magic Link", () => {
    it("GET should return error when token is missing", async () => {
      const request = new Request("http://localhost.com")
      const response = await GETMagicLink(request)
      expect(response.status).toBe(400)
    })

    it("GET should return error for invalid token", async () => {
      const request = new Request("http://localhost.com?token=invalid", {
        headers: { "user-agent": "test" }
      })
      const response = await GETMagicLink(request)
      expect(response.status).toBe(400)
    })

    it("POST should generate magic link", async () => {
      const request = new Request("http://localhost.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" })
      })
      const response = await POST(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })

  describe("Password Reset", () => {
    it("POST should return success when email exists", async () => {
      const request = new Request("http://localhost.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" })
      })
      const response = await POSTReset(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })

    it("POST should return success when email does not exist", async () => {
      const request = new Request("http://localhost.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "nonexistent@example.com" })
      })
      const response = await POSTReset(request)
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(data.success).toBe(true)
    })
  })
})