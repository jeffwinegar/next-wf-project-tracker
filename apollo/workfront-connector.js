import { fetch } from 'cross-fetch';

const BASE_URL = 'https://wunderman.my.workfront.com/attask/api/v12.0/';
const token = process.env.WF_API_KEY;

function projectReducer(proj) {
  return {
    id: proj.ID,
    name: proj.name,
    expireDate: proj.plannedCompletionDate,
    client: proj['DE:Wun LA | Client / Portfolio'],
    program: proj['DE:Wun LA Program for Innocean HMA']
      ? proj['DE:Wun LA Program for Innocean HMA']
      : proj['DE:Wun LA Program for Innocean GMA'] &&
        proj['DE:Wun LA Program for Innocean GMA'],
    tasks: async () => await getAllTasksByProjectID({ projID: proj.ID }),
    hours: async () => await getAllHoursByProjectID({ projID: proj.ID }),
  };
}

function userReducer(user) {
  return {
    id: user.ID,
    firstName: user.firstName,
    lastName: user.lastName,
    title: user.title,
    email: user.emailAddr,
  };
}

function taskReducer(task) {
  return {
    id: task.ID,
    role: task.name,
    roleID: task.roleID,
    projectID: task.projectID,
    hoursScoped: task.workRequired ? task.workRequired / 60 : 0,
    assignedTo: async () => await getUserByID({ userID: task.assignedToID }),
  };
}

function hoursReducer(hours) {
  return {
    id: hours.ID,
    role: hours.name,
    roleID: hours.roleID,
    hoursLogged: Array.isArray(hours.hours)
      ? hours.hours.reduce((acc, cur) => acc + cur, 0)
      : hours.hours,
  };
}

async function getUserByID({ userID }) {
  const res = await fetch(
    `${BASE_URL}/user/${userID}?fields=firstName,lastName,title,emailAddr&apiKey=${token}`
  );
  const json = await res.json();
  const data = json.data;

  return userReducer(data);
}

async function getAllTasksByProjectID({ projID }) {
  const res = await fetch(
    `${BASE_URL}/task/search?projectID=${projID}&fields=projectID,roleID,role,DE:Wun+Standard+|+Estimate+Task,workRequired,assignedToID&$$LIMIT=2000&apiKey=${token}`
  );
  const json = await res.json();
  const data = json.data;

  const filteredData = data.filter((itm) => {
    if (!itm['DE:Wun Standard | Estimate Task']) {
      return;
    }
    if (!itm['DE:Wun Standard | Estimate Task'] === 'Yes') {
      return;
    }
    if (!itm.roleID) {
      return;
    }
    return itm;
  });

  return filteredData.map((itm) => taskReducer(itm));
}

async function getAllHoursByProjectID(projID) {
  const res = await fetch(
    `${BASE_URL}/hour/search?projectID=${projID}&fields=projectID,roleID,hours&$$LIMIT=2000&apiKey=${token}`
  );
  const json = await res.json();
  const data = json.data;

  /**
   * Combines logged hours into an array of roles
   * with total hoursLogged for each role
   */
  const seen = new Map();

  const filteredData = data.filter((hours) => {
    let prev;

    if (seen.hasOwnProperty(hours.roleID)) {
      prev = seen[hours.roleID];
      prev.hours.push(hours.hours);

      return false;
    }

    if (!Array.isArray(hours.hours)) {
      hours.hours = [hours.hours];
    }

    seen[hours.roleID] = hours;

    return true;
  });

  return filteredData.map((itm) => hoursReducer(itm));
}

export async function getAllProjects(companyID) {
  const res = await fetch(
    `${BASE_URL}/proj/search?companyID=${companyID}&status=CUR&plannedCompletionDate=$$TODAY&plannedCompletionDate_Mod=gte&fields=DE:Wun+LA+|+Client+/+Portfolio,DE:Wun+LA+Program+for+Innocean+HMA,DE:Wun+LA+Program+for+Innocean+GMA,plannedCompletionDate&$$LIMIT=2000&apiKey=${token}`
  );
  const json = await res.json();
  const data = json.data;

  return Array.isArray(data) ? data.map((proj) => projectReducer(proj)) : [];
}

export async function getProjectByID(projID) {
  const res = await fetch(
    `${BASE_URL}/proj/${projID}?fields=DE:Wun+LA+|+Client+/+Portfolio,DE:Wun+LA+Program+for+Innocean+HMA,DE:Wun+LA+Program+for+Innocean+GMA,plannedCompletionDate&apiKey=${token}`
  );
  const json = await res.json();
  const data = json.data;

  return projectReducer(data);
}
