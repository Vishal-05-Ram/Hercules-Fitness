"use client";

import { useMemo, useState } from "react";

type Member = {
  id: number;
  name: string;
  phone: string;
  plan: string;
  admissionDate: string;
  dueDate: string;
  amount: number;
  status: "Active" | "Due" | "Expired";
};

const initialMembers: Member[] = [
  { id: 1, name: "Arun Kumar", phone: "9876543210", plan: "Monthly", admissionDate: "2026-09-01", dueDate: "2026-10-01", amount: 1500, status: "Active" },
  { id: 2, name: "Rahul", phone: "9876501234", plan: "Quarterly", admissionDate: "2026-07-16", dueDate: "2026-10-16", amount: 4000, status: "Active" },
  { id: 3, name: "Karthik", phone: "9123456780", plan: "Yearly", admissionDate: "2025-09-10", dueDate: "2026-09-10", amount: 12000, status: "Due" }
];

function daysFromToday(date: string) {
  const d = new Date(date);
  const today = new Date();
  d.setHours(0,0,0,0);
  today.setHours(0,0,0,0);
  return Math.round((d.getTime() - today.getTime()) / 86400000);
}

export default function Home() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [selected, setSelected] = useState<Member | null>(null);

  const filtered = useMemo(
    () => members.filter(m =>
      `${m.name} ${m.phone}`.toLowerCase().includes(search.toLowerCase())
    ),
    [members, search]
  );

  const active = members.filter(m => m.status === "Active").length;
  const due = members.filter(m => m.status === "Due").length;
  const expiring = members.filter(m => {
    const days = daysFromToday(m.dueDate);
    return days >= 0 && days <= 7;
  }).length;

  function addMember(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const admissionDate = String(form.get("admissionDate"));
    const dueDate = String(form.get("dueDate"));
    const newMember: Member = {
      id: Date.now(),
      name: String(form.get("name")),
      phone: String(form.get("phone")),
      plan: String(form.get("plan")),
      admissionDate,
      dueDate,
      amount: Number(form.get("amount")),
      status: daysFromToday(dueDate) < 0 ? "Expired" : "Active"
    };
    setMembers(prev => [newMember, ...prev]);
    setShowForm(false);
    e.currentTarget.reset();
  }

  function deleteMember(id: number) {
    if (confirm("Delete this member?")) {
      setMembers(prev => prev.filter(m => m.id !== id));
      setSelected(null);
    }
  }

  return (
    <main>
      <aside className="sidebar">
        <div className="logo">H</div>
        <h1>Hercules<br />Fitness</h1>
        <nav>
          <a className="active">Dashboard</a>
          <a>Members</a>
          <a>Payments</a>
          <a>Reports</a>
          <a>Settings</a>
        </nav>
      </aside>

      <section className="content">
        <header>
          <div>
            <p className="eyebrow">GYM MANAGEMENT</p>
            <h2>Dashboard</h2>
          </div>
          <button className="primary" onClick={() => setShowForm(true)}>+ Add Member</button>
        </header>

        <div className="cards">
          <div className="card"><span>Total Members</span><strong>{members.length}</strong></div>
          <div className="card"><span>Active Members</span><strong>{active}</strong></div>
          <div className="card warning"><span>Fees Due</span><strong>{due}</strong></div>
          <div className="card"><span>Expiring Soon</span><strong>{expiring}</strong></div>
        </div>

        <div className="panel">
          <div className="panelHead">
            <div>
              <h3>Members</h3>
              <p>Manage your gym members and membership dates.</p>
            </div>
            <input
              className="search"
              placeholder="Search name or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="tableWrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Phone</th><th>Plan</th><th>Admission</th><th>Due Date</th><th>Status</th><th></th></tr>
              </thead>
              <tbody>
                {filtered.map(m => (
                  <tr key={m.id}>
                    <td><b>{m.name}</b></td>
                    <td>{m.phone}</td>
                    <td>{m.plan}</td>
                    <td>{m.admissionDate}</td>
                    <td>{m.dueDate}</td>
                    <td><span className={`status ${m.status.toLowerCase()}`}>{m.status}</span></td>
                    <td><button className="linkBtn" onClick={() => setSelected(m)}>View</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {showForm && (
        <div className="overlay">
          <div className="modal">
            <div className="modalHead"><h3>Add Member</h3><button onClick={() => setShowForm(false)}>×</button></div>
            <form onSubmit={addMember}>
              <label>Full Name<input name="name" required /></label>
              <label>Phone Number<input name="phone" required /></label>
              <div className="two">
                <label>Admission Date<input type="date" name="admissionDate" required /></label>
                <label>Fee Due Date<input type="date" name="dueDate" required /></label>
              </div>
              <div className="two">
                <label>Membership Plan
                  <select name="plan">
                    <option>Monthly</option><option>Quarterly</option><option>Half-Yearly</option><option>Yearly</option><option>Custom</option>
                  </select>
                </label>
                <label>Amount (₹)<input type="number" name="amount" min="0" required /></label>
              </div>
              <button className="primary full" type="submit">Save Member</button>
            </form>
          </div>
        </div>
      )}

      {selected && (
        <div className="overlay">
          <div className="modal">
            <div className="modalHead"><h3>Member Profile</h3><button onClick={() => setSelected(null)}>×</button></div>
            <div className="profile">
              <div className="avatar">{selected.name.charAt(0)}</div>
              <h2>{selected.name}</h2>
              <p>{selected.phone}</p>
              <div className="details">
                <span>Plan <b>{selected.plan}</b></span>
                <span>Admission <b>{selected.admissionDate}</b></span>
                <span>Due Date <b>{selected.dueDate}</b></span>
                <span>Amount <b>₹{selected.amount.toLocaleString("en-IN")}</b></span>
              </div>
            </div>
            <button className="danger full" onClick={() => deleteMember(selected.id)}>Delete Member</button>
          </div>
        </div>
      )}
    </main>
  );
}