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
    body:  "string?",
    notHas:  "string?",
    has:  "bool?",
    after:  "date?",
    before:  "date?",
  }
}

const QueryService = {
  realm: null,
  async init() {
    this.realm = await Realm.open({path: "querymessage",schema: [QuerySchema, QueryDataSchema], schemaVersion: 12});
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
        this.realm.create("Query", query, true);
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
      setValue("from", query.from),
      setValue('to', query.to),
      setValue('subject', query.subject),
      `${query.body||""}`,
      `${query.notHas? `-{${query.notHas}}` : ""}`,
      setValue('has', query.has?'attachment':"", true),
      setValue('after', query.after && query.after.toISOString().split("T")[0].replace(/-/igm, "/"), true),
      setValue('before',query.before && query.before.toISOString().split("T")[0].replace(/-/gm, "/"), true)].filter(x=>x).join (" ");
  }
};

function setValue(key, value, raw_value) {
  if(value==undefined || value=='') return "";
  if(raw_value) {
      return `${key}:${value}`
  }
  return `${key}:(${value})`;
}

QueryService.init();

export default QueryService;