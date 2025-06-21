import { formDataToStringRecord } from "./object";

describe("formDataToStringRecord", () => {
    it("should convert FormData to string record", () => {
        const formData = new FormData();
        formData.append("name", "John");
        formData.append("age", "30");
        formData.append("file", new File([], "test.txt"));

        const result = formDataToStringRecord(formData);

        expect(result).toStrictEqual({
            name: "John",
            age: "30",
            file: "test.txt",
        });
    });
});
