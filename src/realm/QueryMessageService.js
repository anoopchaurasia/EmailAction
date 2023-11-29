const Realm = require("realm");

const QuerySchema = {
  name: "Query",
  primaryKey: "id",
  properties: {
    query: {type:"QueryData"},
    id: "string",
    name: "string",
    pdf_password: "string?",
    message_ids: "string[]",
    nextPageToken: 'string?',
    completed: {type:'bool', default: false}
  }
};

const QueryDataSchema = {
  name:"QueryData",
  properties:{
    from:  "string?",
    to:  "string?",
    subject:  "string?",
    bodyValue:  "string?",
    notHasValue:  "string?",
    has:  "string?",
    after:  "string?",
    before:  "string?",
  }
}

const QueryService = {
  realm: null,
  async init() {
    this.realm = await Realm.open({path: "querymessage",schema: [QuerySchema, QueryDataSchema], schemaVersion: 8});
  },
  async create(query) {
    try {
      query.id = query.id || Math.random().toString(36).slice(2);
      await this.realm.write(() => {
        this.realm.create("Query", query);
      });
      return true;
    } catch (error) {
      console.error(error, "QueryService.create");
      return false;
    }
  },
  async update(query) {
    try {
      query.id = query.id || Math.random().toString(36).slice(2);
      await this.realm.write(() => {
        this.realm.create("Query", query, "modified");
      });
      return true;
    } catch (error) {
      console.error(error, "QueryService.update");
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
      console.error(error, "QueryService.getAll");
      return [];
    }
  },
  getQueryString(query) {
    return [
      setValue("from", query.query.from),
      setValue('to', query.query.to),
      setValue('subject', query.query.subject),
      `${query.query.bodyValue||""}`,
      `${query.query.notHasValue? `-{${query.query.notHasValue}}` : ""}`,
      setValue('has', query.query.notHasValue.has?'attachment':"", true),
      setValue('after', query.query.afterValue && query.query.afterValue.toISOString().split("T")[0].replace(/-/igm, "/"), true),
      setValue('before',query.query.beforeValue && query.query.beforeValue.toISOString().split("T")[0].replace(/-/gm, "/"), true)].filter(x=>x).join (" ");
  }
};

QueryService.init();

export default QueryService;