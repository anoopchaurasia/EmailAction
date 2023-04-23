const Realm = require("realm");

const QuerySchema = {
  name: "Query",
  primaryKey: "query",
  properties: {
    query: "string",
    name: "string",
    message_ids: "string[]",
    nextPageToken: 'string?'
  }
};

const QueryService = {
  realm: null,
  async init() {
    this.realm = await Realm.open({path: "querymessage",schema: [QuerySchema], schemaVersion: 4});
  },
  async create(query) {
    try {
      await this.realm.write(() => {
        this.realm.create("Query", query);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async update(query) {
    try {
      await this.realm.write(() => {
        this.realm.create("Query", query, "modified");
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async delete(query) {
    try {
      await this.realm.write(() => {
        let obj = this.realm.objectForPrimaryKey("Query", query);
        this.realm.delete(obj);
      });
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  getAll() {
    try {
      let results = this.realm.objects("Query");
      return results.map((obj) => obj.toJSON());
    } catch (error) {
      console.error(error);
      return [];
    }
  }
};

QueryService.init();

export default QueryService;