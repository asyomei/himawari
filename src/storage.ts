import fs from "node:fs/promises"

export class Storage<T = any> {
  constructor(private ns: string) {}

  async save(key: string | number, value: T): Promise<void> {
    await fs.mkdir(`botdata/${this.ns}`, { recursive: true })
    await fs.writeFile(`botdata/${this.ns}/${key}.json`, JSON.stringify(value))
  }

  async load(key: string | number): Promise<T | undefined> {
    return await fs
      .readFile(`botdata/${this.ns}/${key}.json`, "utf8")
      .then(JSON.parse, () => undefined)
  }

  async delete(key: string | number): Promise<void> {
    await fs.rm(`botdata/${this.ns}/${key}.json`, { force: true })
  }
}
