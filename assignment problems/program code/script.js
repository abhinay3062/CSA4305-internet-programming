const KEY = "studentSkillSystemData";

const defaultData = {
  profile: {
    name: "Demo Student",
    registerNumber: "CSE001",
    email: "student@example.com",
    department: "Computer Science and Engineering",
    year: "3rd Year",
    careerGoal: "Software Developer"
  },
  skills: [
    {name:"Java",category:"Programming",current:4,required:5},
    {name:"Python",category:"Programming",current:5,required:5},
    {name:"HTML/CSS",category:"Web Development",current:4,required:4},
    {name:"JavaScript",category:"Web Development",current:3,required:5}
  ],
  assessments: [],
  certifications: [],
  projects: [],
  user: {email:"student@example.com",password:"1234"}
};

function getData(){
  const saved = localStorage.getItem(KEY);
  if(!saved){
    localStorage.setItem(KEY, JSON.stringify(defaultData));
    return JSON.parse(JSON.stringify(defaultData));
  }
  return JSON.parse(saved);
}

function saveData(data){ localStorage.setItem(KEY, JSON.stringify(data)); }

function escapeHTML(value){
  return String(value ?? "").replace(/[&<>"']/g, ch => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[ch]));
}

function logout(){
  localStorage.removeItem("loggedIn");
  location.href = "login.html";
}

function checkLogin(){
  const publicPages = ["login.html","registration.html"];
  const page = location.pathname.split("/").pop() || "index.html";
  if(!publicPages.includes(page) && localStorage.getItem("loggedIn") !== "true"){
    location.href = "login.html";
  }
}

function initLogin(){
  const form = document.getElementById("loginForm");
  if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const email = document.getElementById("loginEmail").value.trim();
    const password = document.getElementById("loginPassword").value;
    const data = getData();
    const msg = document.getElementById("loginMessage");
    if(email === data.user.email && password === data.user.password){
      localStorage.setItem("loggedIn","true");
      location.href = "index.html";
    }else{
      msg.textContent = "Invalid email or password.";
      msg.className = "message danger";
    }
  });
}

function initRegistration(){
  const form = document.getElementById("registrationForm");
  if(!form) return;
  form.addEventListener("submit", e=>{
    e.preventDefault();
    const data = getData();
    data.profile = {
      name:document.getElementById("regName").value.trim(),
      registerNumber:document.getElementById("regNumber").value.trim(),
      email:document.getElementById("regEmail").value.trim(),
      department:"Computer Science and Engineering",
      year:"1st Year",
      careerGoal:""
    };
    data.user.email = data.profile.email;
    data.user.password = document.getElementById("regPassword").value;
    saveData(data);
    const msg = document.getElementById("registrationMessage");
    msg.textContent = "Registration successful. You can now login.";
    msg.className = "message success";
    form.reset();
  });
}

function saveProfile(){
  const data = getData();
  data.profile = {
    name:document.getElementById("studentName").value.trim(),
    registerNumber:document.getElementById("registerNumber").value.trim(),
    email:document.getElementById("email").value.trim(),
    department:document.getElementById("department").value.trim(),
    year:document.getElementById("year").value,
    careerGoal:document.getElementById("careerGoal").value.trim()
  };
  saveData(data);
  const msg = document.getElementById("profileMessage");
  if(msg){msg.textContent="Profile saved successfully.";msg.className="message success";}
  renderAll();
}

function loadProfileForm(){
  const el = document.getElementById("studentName");
  if(!el) return;
  const p = getData().profile;
  document.getElementById("studentName").value=p.name;
  document.getElementById("registerNumber").value=p.registerNumber;
  document.getElementById("email").value=p.email;
  document.getElementById("department").value=p.department;
  document.getElementById("year").value=p.year;
  document.getElementById("careerGoal").value=p.careerGoal;
}

function addSkill(){
  const name=document.getElementById("skillName").value.trim();
  const category=document.getElementById("category").value;
  const current=Number(document.getElementById("currentLevel").value);
  const required=Number(document.getElementById("requiredLevel").value);
  if(!name || current<1 || current>5 || required<1 || required>5){
    alert("Enter valid skill details. Levels must be between 1 and 5.");
    return;
  }
  const data=getData();
  if(data.skills.some(s=>s.name.toLowerCase()===name.toLowerCase())){
    alert("This skill already exists.");
    return;
  }
  data.skills.push({name,category,current,required});
  saveData(data);
  document.getElementById("skillForm").reset();
  renderAll();
}

function deleteSkill(index){
  const data=getData();
  data.skills.splice(index,1);
  saveData(data);
  renderAll();
}

function calculateAssessment(){
  const skill=document.getElementById("assessmentSkill").value;
  const score=Number(document.getElementById("assessmentScore").value);
  if(score<0 || score>100){alert("Score must be between 0 and 100.");return;}
  let level = score>=80 ? "Advanced" : score>=60 ? "Intermediate" : score>=40 ? "Beginner" : "Needs Improvement";
  const data=getData();
  data.assessments.push({date:new Date().toLocaleDateString(),skill,score,level});
  const existing=data.skills.find(s=>s.name.toLowerCase()===skill.toLowerCase());
  if(existing){
    existing.current = level==="Advanced" ? 5 : level==="Intermediate" ? 4 : level==="Beginner" ? 3 : 2;
  }else{
    data.skills.push({name:skill,category:"Assessment",current:level==="Advanced"?5:level==="Intermediate"?4:level==="Beginner"?3:2,required:5});
  }
  saveData(data);
  document.getElementById("assessmentResult").innerHTML =
    `<div class="recommendation"><strong>${escapeHTML(skill)}</strong><br>Score: ${score}/100<br>Level: ${level}</div>`;
  document.getElementById("assessmentForm").reset();
  renderAll();
}

function addCertification(){
  const data=getData();
  const name=document.getElementById("certName").value.trim();
  if(!name){alert("Enter certificate name.");return;}
  data.certifications.push({
    name,
    organization:document.getElementById("certOrg").value.trim(),
    date:document.getElementById("certDate").value,
    id:document.getElementById("certId").value.trim()
  });
  saveData(data);
  document.querySelector("form").reset();
  renderAll();
}

function deleteCertification(index){
  const data=getData(); data.certifications.splice(index,1); saveData(data); renderAll();
}

function addProject(){
  const data=getData();
  const name=document.getElementById("projectName").value.trim();
  if(!name){alert("Enter project name.");return;}
  data.projects.push({
    name,
    tech:document.getElementById("projectTech").value.trim(),
    type:document.getElementById("projectType").value,
    duration:document.getElementById("projectDuration").value.trim(),
    description:document.getElementById("projectDescription").value.trim()
  });
  saveData(data);
  document.querySelector("form").reset();
  renderAll();
}

function deleteProject(index){
  const data=getData(); data.projects.splice(index,1); saveData(data); renderAll();
}

function renderDashboard(){
  const data=getData();
  const total=data.skills.length;
  const avg=total ? data.skills.reduce((sum,s)=>sum+s.current,0)/total : 0;
  const gaps=data.skills.filter(s=>s.required>s.current).length;
  const progress=total ? data.skills.reduce((sum,s)=>sum+Math.min(100,(s.current/s.required)*100),0)/total : 0;

  const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value;};
  set("totalSkills",total); set("averageSkill",avg.toFixed(2)); set("skillGaps",gaps); set("progress",progress.toFixed(1)+"%");

  const table=document.getElementById("skillTable");
  if(table){
    table.innerHTML=data.skills.map((s,i)=>{
      const gap=s.required-s.current;
      return `<tr><td>${escapeHTML(s.name)}</td><td>${escapeHTML(s.category)}</td><td>${s.current}</td><td>${s.required}</td><td>${gap>0?gap:0}</td><td>${gap>0?"Improvement Required":"Achieved"}</td><td><button class="delete-btn" onclick="deleteSkill(${i})">Delete</button></td></tr>`;
    }).join("") || `<tr><td colspan="7">No skills added.</td></tr>`;
  }

  const rec=document.getElementById("recommendationList");
  if(rec){
    const gapsList=data.skills.filter(s=>s.required>s.current);
    rec.innerHTML=gapsList.length ? gapsList.map(s=>`<div class="recommendation"><strong>${escapeHTML(s.name)}</strong><p>Current level ${s.current}, target level ${s.required}. Recommended activity: practice ${escapeHTML(s.name)}, complete a related course and take another assessment.</p></div>`).join("") : "<p>No skill gaps currently identified.</p>";
  }
}

function renderAssessment(){
  const table=document.getElementById("assessmentTable");
  if(!table)return;
  const data=getData();
  table.innerHTML=data.assessments.map(a=>`<tr><td>${escapeHTML(a.date)}</td><td>${escapeHTML(a.skill)}</td><td>${a.score}</td><td>${escapeHTML(a.level)}</td></tr>`).join("") || `<tr><td colspan="4">No assessment records.</td></tr>`;
}

function renderCertifications(){
  const table=document.getElementById("certTable");
  if(!table)return;
  const data=getData();
  table.innerHTML=data.certifications.map((c,i)=>`<tr><td>${escapeHTML(c.name)}</td><td>${escapeHTML(c.organization)}</td><td>${escapeHTML(c.date)}</td><td>${escapeHTML(c.id)}</td><td><button class="delete-btn" onclick="deleteCertification(${i})">Delete</button></td></tr>`).join("") || `<tr><td colspan="5">No certifications added.</td></tr>`;
}

function renderProjects(){
  const table=document.getElementById("projectTable");
  if(!table)return;
  const data=getData();
  table.innerHTML=data.projects.map((p,i)=>`<tr><td>${escapeHTML(p.name)}</td><td>${escapeHTML(p.tech)}</td><td>${escapeHTML(p.type)}</td><td>${escapeHTML(p.duration)}</td><td>${escapeHTML(p.description)}</td><td><button class="delete-btn" onclick="deleteProject(${i})">Delete</button></td></tr>`).join("") || `<tr><td colspan="6">No projects added.</td></tr>`;
}

function renderHome(){
  const data=getData();
  const total=data.skills.length;
  const avg=total?data.skills.reduce((a,s)=>a+s.current,0)/total:0;
  const progress=total?data.skills.reduce((a,s)=>a+Math.min(100,(s.current/s.required)*100),0)/total:0;
  const set=(id,v)=>{const e=document.getElementById(id);if(e)e.textContent=v;};
  set("homeStudent",data.profile.name||"Student");
  set("homeSkills",total);set("homeAverage",avg.toFixed(2));set("homeProgress",progress.toFixed(1)+"%");
  const p=document.getElementById("profileSummary");
  if(p)p.innerHTML=`<strong>Name:</strong> ${escapeHTML(data.profile.name)}<br><strong>Register No:</strong> ${escapeHTML(data.profile.registerNumber)}<br><strong>Email:</strong> ${escapeHTML(data.profile.email)}<br><strong>Department:</strong> ${escapeHTML(data.profile.department)}<br><strong>Career Goal:</strong> ${escapeHTML(data.profile.careerGoal||"Not specified")}`;
}

function renderAll(){
  renderDashboard();renderAssessment();renderCertifications();renderProjects();renderHome();
}

document.addEventListener("DOMContentLoaded",()=>{
  checkLogin();
  getData();
  initLogin();
  initRegistration();
  loadProfileForm();
  renderAll();
});
