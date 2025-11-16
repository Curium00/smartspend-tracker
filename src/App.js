import React, { useState, useEffect } from 'react';
import { DollarSign, Download, Filter, Trash2, Edit2, Lock, Mail, User, LogOut } from 'lucide-react';

const SmartSpendApp = () => {
  const [currentPage, setCurrentPage] = useState('landing');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [authError, setAuthError] = useState('');
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Starbucks', category: 'Food', amount: 6, date: '2025-11-14' },
    { id: 2, description: 'Bus pass', category: 'Transport', amount: 45, date: '2025-11-13' },
    { id: 3, description: 'Rent payment', category: 'Rent', amount: 800, date: '2025-11-01' }
  ]);
  const [formData, setFormData] = useState({ amount: '', category: '', notes: '' });
  const [budgets, setBudgets] = useState({ total: 1800, Food: 800, Rent: 800, Transport: 150, Entertainment: 50 });
  const [editingBudget, setEditingBudget] = useState(false);
  const [filterCategory, setFilterCategory] = useState('All');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('smartspend_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogin = () => {
    setAuthError('');
    if (!loginForm.email || !loginForm.password) {
      setAuthError('Please fill in all fields');
      return;
    }
    const users = JSON.parse(localStorage.getItem('smartspend_users') || '[]');
    const user = users.find(u => u.email === loginForm.email && u.password === loginForm.password);
    if (user) {
      setCurrentUser(user);
      setIsLoggedIn(true);
      localStorage.setItem('smartspend_user', JSON.stringify(user));
      setCurrentPage('dashboard');
      showSuccessNotification('Welcome back!');
      setLoginForm({ email: '', password: '' });
    } else {
      setAuthError('Invalid email or password');
    }
  };

  const handleSignup = () => {
    setAuthError('');
    if (!signupForm.name || !signupForm.email || !signupForm.password || !signupForm.confirmPassword) {
      setAuthError('Please fill in all fields');
      return;
    }
    if (signupForm.password !== signupForm.confirmPassword) {
      setAuthError('Passwords do not match');
      return;
    }
    if (signupForm.password.length < 6) {
      setAuthError('Password must be at least 6 characters');
      return;
    }
    const users = JSON.parse(localStorage.getItem('smartspend_users') || '[]');
    if (users.find(u => u.email === signupForm.email)) {
      setAuthError('Email already registered');
      return;
    }
    const newUser = { id: Date.now(), name: signupForm.name, email: signupForm.email, password: signupForm.password };
    users.push(newUser);
    localStorage.setItem('smartspend_users', JSON.stringify(users));
    localStorage.setItem('smartspend_user', JSON.stringify(newUser));
    setCurrentUser(newUser);
    setIsLoggedIn(true);
    setCurrentPage('dashboard');
    showSuccessNotification('Welcome!');
    setSignupForm({ name: '', email: '', password: '', confirmPassword: '' });
  };

  const handleLogout = () => {
    localStorage.removeItem('smartspend_user');
    setCurrentUser(null);
    setIsLoggedIn(false);
    setCurrentPage('landing');
    showSuccessNotification('Logged out!');
  };
  const handleDemoLogin = () => {
  const demoUser = { id: 0, name: 'Demo User', email: 'demo@smartspend.com' };
  setCurrentUser(demoUser);
  setIsLoggedIn(true);
  setCurrentPage('dashboard');
  showSuccessNotification('Welcome to the demo!');
  };

  const requireAuth = (page) => {
    if (!isLoggedIn) {
      setCurrentPage('login');
      showSuccessNotification('Please sign in');
    } else {
      setCurrentPage(page);
    }
  };

  const calculateSpent = () => expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const calculateCategorySpent = (cat) => expenses.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0);
  
  const handleSubmit = () => {
    if (formData.amount && formData.category) {
      setExpenses([{ 
        id: Date.now(), 
        description: formData.notes || 'New expense', 
        category: formData.category, 
        amount: parseFloat(formData.amount), 
        date: new Date().toISOString().split('T')[0] 
      }, ...expenses]);
      setFormData({ amount: '', category: '', notes: '' });
      setCurrentPage('dashboard');
      showSuccessNotification('Expense added!');
    }
  };

  const deleteExpense = (id) => {
    setExpenses(expenses.filter(e => e.id !== id));
    showSuccessNotification('Deleted!');
  };

  const showSuccessNotification = (msg) => {
    setShowNotification(msg);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const exportToCSV = () => {
    const csv = [['Date', 'Category', 'Description', 'Amount'], ...expenses.map(e => [e.date, e.category, e.description, e.amount])].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    showSuccessNotification('Exported!');
  };

  const updateBudget = (cat, val) => setBudgets({...budgets, [cat]: parseFloat(val) || 0});
  const filtered = filterCategory === 'All' ? expenses : expenses.filter(e => e.category === filterCategory);
  const totalSpent = calculateSpent();
  const remaining = budgets.total - totalSpent;
  const spentPct = (totalSpent / budgets.total) * 100;

  // THIS IS A SIMPLIFIED VERSION - Login, Signup, Landing, Dashboard with full features, Add Expense
  // All working with authentication system included!

  if (currentPage === 'login') {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        {showNotification && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:'#10b981',color:'white',padding:'16px 24px',borderRadius:'8px',zIndex:1000}}>{showNotification}</div>}
        <div style={{backgroundColor:'white',borderRadius:'16px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',padding:'48px',maxWidth:'480px',width:'100%'}}>
          <DollarSign size={48} color="#6366f1" style={{display:'block',margin:'0 auto 16px'}} />
          <h1 style={{fontSize:'32px',fontWeight:'bold',textAlign:'center',marginBottom:'8px'}}>Sign In</h1>
          <p style={{textAlign:'center',color:'#6b7280',marginBottom:'32px'}}>Welcome back</p>
          {authError && <div style={{backgroundColor:'#fee2e2',color:'#991b1b',padding:'12px',borderRadius:'8px',marginBottom:'20px'}}>{authError}</div>}
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><Mail size={16} style={{marginRight:'8px'}}/>Email</label>
            <input type="email" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm,email:e.target.value})} onKeyPress={(e)=>e.key==='Enter'&&handleLogin()} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="email@example.com"/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><Lock size={16} style={{marginRight:'8px'}}/>Password</label>
            <input type="password" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})} onKeyPress={(e)=>e.key==='Enter'&&handleLogin()} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="••••••••"/>
          </div>
          <button onClick={handleLogin} style={{width:'100%',backgroundColor:'#6366f1',color:'white',padding:'14px',borderRadius:'8px',fontSize:'16px',fontWeight:'600',border:'none',cursor:'pointer',marginBottom:'12px'}}>Sign In</button>
          <div style={{textAlign:'center',margin:'12px 0',color:'#6b7280'}}>Don't have an account?</div>
          <button onClick={()=>setCurrentPage('signup')} style={{width:'100%',backgroundColor:'white',color:'#6366f1',padding:'12px',borderRadius:'8px',border:'2px solid #6366f1',cursor:'pointer',marginBottom:'12px'}}>Create Account</button>
          <button onClick={()=>setCurrentPage('landing')} style={{width:'100%',background:'none',border:'none',color:'#6b7280',cursor:'pointer'}}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (currentPage === 'signup') {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
        {showNotification && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:'#10b981',color:'white',padding:'16px 24px',borderRadius:'8px',zIndex:1000}}>{showNotification}</div>}
        <div style={{backgroundColor:'white',borderRadius:'16px',boxShadow:'0 20px 60px rgba(0,0,0,0.3)',padding:'48px',maxWidth:'480px',width:'100%'}}>
          <DollarSign size={48} color="#6366f1" style={{display:'block',margin:'0 auto 16px'}} />
          <h1 style={{fontSize:'32px',fontWeight:'bold',textAlign:'center',marginBottom:'8px'}}>Create Account</h1>
          <p style={{textAlign:'center',color:'#6b7280',marginBottom:'32px'}}>Start managing finances</p>
          {authError && <div style={{backgroundColor:'#fee2e2',color:'#991b1b',padding:'12px',borderRadius:'8px',marginBottom:'20px'}}>{authError}</div>}
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><User size={16} style={{marginRight:'8px'}}/>Name</label>
            <input type="text" value={signupForm.name} onChange={(e)=>setSignupForm({...signupForm,name:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="John Doe"/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><Mail size={16} style={{marginRight:'8px'}}/>Email</label>
            <input type="email" value={signupForm.email} onChange={(e)=>setSignupForm({...signupForm,email:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="email@example.com"/>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><Lock size={16} style={{marginRight:'8px'}}/>Password</label>
            <input type="password" value={signupForm.password} onChange={(e)=>setSignupForm({...signupForm,password:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="••••••••"/>
            <div style={{fontSize:'12px',color:'#6b7280',marginTop:'4px'}}>At least 6 characters</div>
          </div>
          <div style={{marginBottom:'20px'}}>
            <label style={{display:'flex',alignItems:'center',marginBottom:'8px',fontSize:'14px',fontWeight:'500'}}><Lock size={16} style={{marginRight:'8px'}}/>Confirm</label>
            <input type="password" value={signupForm.confirmPassword} onChange={(e)=>setSignupForm({...signupForm,confirmPassword:e.target.value})} onKeyPress={(e)=>e.key==='Enter'&&handleSignup()} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="••••••••"/>
          </div>
          <button onClick={handleSignup} style={{width:'100%',backgroundColor:'#6366f1',color:'white',padding:'14px',borderRadius:'8px',fontSize:'16px',fontWeight:'600',border:'none',cursor:'pointer',marginBottom:'12px'}}>Create Account</button>
          <div style={{textAlign:'center',margin:'12px 0',color:'#6b7280'}}>Have an account?</div>
          <button onClick={()=>setCurrentPage('login')} style={{width:'100%',backgroundColor:'white',color:'#6366f1',padding:'12px',borderRadius:'8px',border:'2px solid #6366f1',cursor:'pointer',marginBottom:'12px'}}>Sign In</button>
          <button onClick={()=>setCurrentPage('landing')} style={{width:'100%',background:'none',border:'none',color:'#6b7280',cursor:'pointer'}}>Back to Home</button>
        </div>
      </div>
    );
  }

  if (currentPage === 'landing') {
    return (
      <div style={{minHeight:'100vh',background:'linear-gradient(to bottom right,#f9fafb,#f3f4f6)'}}>
        {showNotification && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:'#10b981',color:'white',padding:'16px 24px',borderRadius:'8px',zIndex:1000}}>{showNotification}</div>}
        <nav style={{backgroundColor:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',position:'sticky',top:0,zIndex:50}}>
          <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 24px',display:'flex',justifyContent:'space-between',alignItems:'center',height:'64px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px',cursor:'pointer'}} onClick={()=>setCurrentPage('landing')}>
              <DollarSign size={32} color="#6366f1"/>
              <span style={{fontSize:'24px',fontWeight:'bold'}}>SmartSpend</span>
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              {isLoggedIn ? (
                <>
                  <button onClick={()=>requireAuth('dashboard')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}}>Dashboard</button>
                  <button onClick={handleLogout} style={{backgroundColor:'#6366f1',color:'white',padding:'8px 24px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}><LogOut size={16}/>Logout</button>
                </>
              ) : (
                <>
                  <button onClick={()=>setCurrentPage('login')} style={{background:'none',border:'none',cursor:'pointer',fontSize:'16px'}}>Sign in</button>
                  <button onClick={()=>setCurrentPage('signup')} style={{backgroundColor:'#6366f1',color:'white',padding:'8px 24px',borderRadius:'8px',border:'none',cursor:'pointer'}}>Get started</button>
                </>
              )}
            </div>
          </div>
        </nav>
        <section style={{maxWidth:'1280px',margin:'0 auto',padding:'80px 24px',textAlign:'center'}}>
          <h1 style={{fontSize:'56px',fontWeight:'bold',marginBottom:'24px'}}>Take control of your student budget</h1>
          <p style={{fontSize:'20px',color:'#4b5563',marginBottom:'32px'}}>Track expenses, stay within budget, see where money goes.</p>
          <div style={{display:'flex',gap:'16px',justifyContent:'center'}}>
            <button onClick={()=>isLoggedIn?requireAuth('dashboard'):setCurrentPage('signup')} style={{backgroundColor:'#6366f1',color:'white',padding:'16px 32px',borderRadius:'8px',fontSize:'18px',fontWeight:'600',border:'none',cursor:'pointer'}}>{isLoggedIn?'Dashboard':'Get started'}</button>
            <button onClick={handleDemoLogin} style={{backgroundColor:'white',color:'#6366f1',padding:'16px 32px',borderRadius:'8px',fontSize:'18px',fontWeight:'600',border:'2px solid #6366f1',cursor:'pointer'}}>Try Demo</button>
          </div>
        </section>
        <footer style={{backgroundColor:'#111827',color:'white',padding:'48px 0',marginTop:'80px'}}>
          <div style={{textAlign:'center',color:'#9ca3af'}}>© 2025 SmartSpend. SOFE 4850U Project.</div>
        </footer>
      </div>
    );
  }

  // Continue to next comment for Dashboard and Add Expense pages
  if (currentPage === 'dashboard') {
    return (
      <div style={{minHeight:'100vh',backgroundColor:'#f9fafb'}}>
        {showNotification && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:'#10b981',color:'white',padding:'16px 24px',borderRadius:'8px',zIndex:1000}}>{showNotification}</div>}
        <nav style={{backgroundColor:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
          <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 24px',display:'flex',justifyContent:'space-between',alignItems:'center',height:'64px'}}>
            <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
              <DollarSign size={32} color="#6366f1"/>
              <span style={{fontSize:'24px',fontWeight:'bold'}}>SmartSpend</span>
            </div>
            <div style={{display:'flex',gap:'16px'}}>
              <button onClick={exportToCSV} style={{backgroundColor:'#10b981',color:'white',padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}><Download size={16}/>Export</button>
              <button onClick={handleLogout} style={{backgroundColor:'#ef4444',color:'white',padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}><LogOut size={16}/>Logout</button>
            </div>
          </div>
        </nav>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'32px 24px'}}>
          <div style={{display:'flex',justifyContent:'space-between',marginBottom:'32px'}}>
            <h1 style={{fontSize:'30px',fontWeight:'bold'}}>Dashboard {currentUser ? `- Welcome, ${currentUser.name}!` : ''}</h1>
            <button onClick={()=>requireAuth('addExpense')} style={{backgroundColor:'#6366f1',color:'white',padding:'12px 24px',borderRadius:'8px',border:'none',cursor:'pointer'}}>+ Add Expense</button>
          </div>
          
          <div style={{backgroundColor:'white',borderRadius:'12px',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)',padding:'32px',marginBottom:'32px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'24px'}}>
              <h2 style={{fontSize:'20px',fontWeight:'600'}}>Budget overview</h2>
              <button onClick={()=>setEditingBudget(!editingBudget)} style={{backgroundColor:'#f3f4f6',padding:'8px 16px',borderRadius:'8px',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:'8px'}}><Edit2 size={16}/>{editingBudget?'Done':'Edit'}</button>
            </div>
            {editingBudget && (
              <div style={{backgroundColor:'#f9fafb',padding:'16px',borderRadius:'8px',marginBottom:'24px'}}>
                <label>Total: </label>
                <input type="number" value={budgets.total} onChange={(e)=>updateBudget('total',e.target.value)} style={{padding:'8px',border:'1px solid #d1d5db',borderRadius:'6px',width:'120px',marginLeft:'8px'}}/>
              </div>
            )}
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-around',flexWrap:'wrap',gap:'32px'}}>
              <div style={{position:'relative'}}>
                <svg width="256" height="256" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="128" cy="128" r="100" stroke="#e5e7eb" strokeWidth="20" fill="none"/>
                  <circle cx="128" cy="128" r="100" stroke={spentPct>90?'#ef4444':'#6366f1'} strokeWidth="20" fill="none" strokeDasharray={Math.min(spentPct,100)*6.28+' 628'} strokeLinecap="round"/>
                </svg>
                <div style={{position:'absolute',top:0,left:0,right:0,bottom:0,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center'}}>
                  <div style={{fontSize:'30px',fontWeight:'bold'}}>${totalSpent}</div>
                  <div style={{color:'#6b7280'}}>of ${budgets.total}</div>
                </div>
              </div>
              <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'24px'}}>
                <div style={{textAlign:'center'}}><div style={{color:'#6b7280',fontSize:'14px'}}>Total</div><div style={{fontSize:'24px',fontWeight:'bold'}}>${budgets.total}</div></div>
                <div style={{textAlign:'center'}}><div style={{color:'#6b7280',fontSize:'14px'}}>Spent</div><div style={{fontSize:'24px',fontWeight:'bold',color:'#6366f1'}}>${totalSpent}</div></div>
                <div style={{textAlign:'center'}}><div style={{color:'#6b7280',fontSize:'14px'}}>Remaining</div><div style={{fontSize:'24px',fontWeight:'bold',color:remaining>=0?'#10b981':'#ef4444'}}>${remaining}</div></div>
                <div style={{textAlign:'center'}}><div style={{color:'#6b7280',fontSize:'14px'}}>%</div><div style={{fontSize:'24px',fontWeight:'bold',color:spentPct>90?'#ef4444':'#8b5cf6'}}>{spentPct.toFixed(0)}%</div></div>
              </div>
            </div>
          </div>

          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(250px,1fr))',gap:'24px',marginBottom:'32px'}}>
            {Object.entries(budgets).filter(([k])=>k!=='total').map(([cat,bud])=>{
              const spent=calculateCategorySpent(cat);
              const pct=(spent/bud)*100;
              return (
                <div key={cat} style={{backgroundColor:'white',borderRadius:'12px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',padding:'24px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'16px'}}>
                    <div>
                      <h3 style={{fontWeight:'600',marginBottom:'4px'}}>{cat}</h3>
                      <div style={{fontSize:'24px',fontWeight:'bold'}}>${spent}</div>
                    </div>
                    <div style={{fontSize:'14px',color:'#6b7280'}}>
                      {editingBudget ? (
                        <input type="number" value={bud} onChange={(e)=>updateBudget(cat,e.target.value)} style={{padding:'4px 8px',border:'1px solid #d1d5db',borderRadius:'4px',width:'70px'}}/>
                      ) : (
                        'of $'+bud
                      )}
                    </div>
                  </div>
                  <div style={{height:'8px',backgroundColor:'#e5e7eb',borderRadius:'9999px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:Math.min(pct,100)+'%',backgroundColor:pct>90?'#ef4444':pct>70?'#f59e0b':'#10b981'}}></div>
                  </div>
                  <div style={{fontSize:'14px',color:'#6b7280',marginTop:'8px'}}>{pct.toFixed(0)}% used</div>
                </div>
              );
            })}
          </div>

          <div style={{backgroundColor:'white',borderRadius:'12px',boxShadow:'0 10px 15px -3px rgba(0,0,0,0.1)',padding:'32px'}}>
            <div style={{display:'flex',justifyContent:'space-between',marginBottom:'24px',flexWrap:'wrap',gap:'12px'}}>
              <h2 style={{fontSize:'20px',fontWeight:'600'}}>Recent Transactions</h2>
              <div style={{display:'flex',gap:'12px',alignItems:'center'}}>
                <Filter size={16} color="#6b7280"/>
                <select value={filterCategory} onChange={(e)=>setFilterCategory(e.target.value)} style={{padding:'8px 12px',border:'1px solid #d1d5db',borderRadius:'6px',cursor:'pointer'}}>
                  <option value="All">All Categories</option>
                  <option value="Food">Food</option>
                  <option value="Transport">Transport</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
            </div>
            {filtered.length===0 ? (
              <div style={{textAlign:'center',color:'#6b7280',padding:'40px'}}>No expenses yet. Click + Add Expense!</div>
            ) : (
              filtered.map(exp=>(
                <div key={exp.id} style={{display:'flex',justifyContent:'space-between',padding:'16px',backgroundColor:'#f9fafb',borderRadius:'8px',marginBottom:'8px'}}>
                  <div>
                    <div style={{fontWeight:'500'}}>{exp.description}</div>
                    <div style={{fontSize:'14px',color:'#6b7280'}}><span style={{color:'#6366f1',fontWeight:'500'}}>{exp.category}</span> - {exp.date}</div>
                  </div>
                  <div style={{display:'flex',alignItems:'center',gap:'16px'}}>
                    <span style={{fontSize:'18px',fontWeight:'600'}}>${exp.amount}</span>
                    <button onClick={()=>deleteExpense(exp.id)} style={{backgroundColor:'#fee2e2',color:'#ef4444',padding:'8px',borderRadius:'6px',border:'none',cursor:'pointer'}}><Trash2 size={16}/></button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    );
  }

  // Add Expense Page
  return (
    <div style={{minHeight:'100vh',backgroundColor:'#f9fafb'}}>
      {showNotification && <div style={{position:'fixed',top:'20px',right:'20px',backgroundColor:'#10b981',color:'white',padding:'16px 24px',borderRadius:'8px',zIndex:1000}}>{showNotification}</div>}
      <nav style={{backgroundColor:'white',boxShadow:'0 1px 3px rgba(0,0,0,0.1)'}}>
        <div style={{maxWidth:'1280px',margin:'0 auto',padding:'0 24px',display:'flex',justifyContent:'space-between',alignItems:'center',height:'64px'}}>
          <button onClick={()=>setCurrentPage('dashboard')} style={{background:'none',border:'none',color:'#6366f1',cursor:'pointer',fontSize:'16px'}}>← Back</button>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <DollarSign size={32} color="#6366f1"/>
            <span style={{fontSize:'24px',fontWeight:'bold'}}>SmartSpend</span>
          </div>
        </div>
      </nav>
      <div style={{maxWidth:'672px',margin:'0 auto',padding:'48px 24px'}}>
        <div style={{backgroundColor:'white',borderRadius:'12px',boxShadow:'0 1px 3px rgba(0,0,0,0.1)',padding:'32px'}}>
          <h1 style={{fontSize:'30px',fontWeight:'bold',marginBottom:'32px'}}>Add Expense</h1>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'14px',fontWeight:'500',marginBottom:'8px'}}>Amount *</label>
            <input type="number" value={formData.amount} onChange={(e)=>setFormData({...formData,amount:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',fontSize:'16px',boxSizing:'border-box'}} placeholder="25.50"/>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'14px',fontWeight:'500',marginBottom:'8px'}}>Category *</label>
            <select value={formData.category} onChange={(e)=>setFormData({...formData,category:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',cursor:'pointer',fontSize:'16px',boxSizing:'border-box'}}>
              <option value="">Select category</option>
              <option value="Food">🍔 Food</option>
              <option value="Transport">🚗 Transport</option>
              <option value="Entertainment">🎬 Entertainment</option>
              <option value="Rent">🏠 Rent</option>
            </select>
          </div>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',fontSize:'14px',fontWeight:'500',marginBottom:'8px'}}>Notes</label>
            <textarea value={formData.notes} onChange={(e)=>setFormData({...formData,notes:e.target.value})} style={{width:'100%',padding:'12px 16px',border:'1px solid #d1d5db',borderRadius:'8px',minHeight:'120px',resize:'vertical',fontFamily:'inherit',fontSize:'16px',boxSizing:'border-box'}} placeholder="Add notes..."/>
          </div>
          <button onClick={handleSubmit} style={{width:'100%',backgroundColor:'#6366f1',color:'white',padding:'16px',borderRadius:'8px',fontSize:'18px',fontWeight:'600',border:'none',cursor:'pointer',opacity:(formData.amount&&formData.category)?1:0.5}} disabled={!formData.amount||!formData.category}>Save Expense</button>
          <button onClick={()=>setCurrentPage('dashboard')} style={{width:'100%',backgroundColor:'white',color:'#6b7280',padding:'12px',borderRadius:'8px',border:'1px solid #d1d5db',cursor:'pointer',marginTop:'12px'}}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default SmartSpendApp;