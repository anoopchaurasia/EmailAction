import { NativeModules } from 'react-native';
const QueryModule = NativeModules.QueryModule;

const QueryService = {
  
  async create(query) {
    try {
      await QueryModule.create(query);
      return true;
    } catch (error) {
      console.error(error, "QueryService.create");
      return false;
    }
  },

  async deleteAll () {
    try {
      await QueryModule.deleteAll();
    } catch (error) {
      console.error(error, "QueryService.deleteAll");
    }
  },
  async update(query) {
    try {
      await QueryModule.update(query);
      return true;
    } catch (error) {
      console.error(error, "QueryService.update");
      return false;
    }
  },
  async delete(id) {
    try {
      await QueryModule.delete(id);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
  async getAll() {
    try {
      return await QueryModule.getAll();
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


export default QueryService;