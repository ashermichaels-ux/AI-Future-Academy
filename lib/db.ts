// Mock DB for build. Replace with Prisma later
export const db = {
  certificates: {
    findUnique: async (args: any) => {
      console.log("Mock DB: findUnique called", args)
      return null
    },
    create: async (data: any) => {
      console.log("Mock DB: create called", data)
      return {
        id: Math.floor(Math.random() * 10000),
        ...data.data
      }
    }
  }
}
