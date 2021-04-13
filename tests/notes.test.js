describe("routes", () => {
  describe("notes", () => {
    describe("post", () => {
      test("a valid note can be added", async () => {
        const newNote = {
          content: "Hola amigazo, soy una nueva nota",
          important: false,
        };

        await api.post("/api/notes").send(newNote).expect(200);
      });
    });
  });
});
