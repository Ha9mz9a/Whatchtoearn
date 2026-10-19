import React, { useState, useEffect } from 'react';
import { auth, db } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export default function App() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  // متابعة حالة تسجيل الدخول للمستخدم
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchTasks();
      }
    });
    return () => unsubscribe();
  }, []);

  // جلب المهام من قاعدة البيانات
  const fetchTasks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "tasks"));
      const tasksList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksList);
    } catch (error) {
      console.error("Error fetching tasks: ", error);
    }
  };

  // تسجيل حساب أو تسجيل دخول
  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  // تسجيل الخروج
  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', color: '#fff', fontFamily: 'sans-serif', padding: '20px' }}>
      <div style={{ maxWidth: '600px', margin: '0 auto', background: '#1e293b', padding: '24px', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)' }}>
        <h1 style={{ textAlign: 'center', color: '#38bdf8' }}>Whatchtoearn 🚀</h1>
        
        {!user ? (
          <div>
            <h2>{isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}</h2>
            <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input 
                type="email" 
                placeholder="البريد الإلكتروني" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
              />
              <input 
                type="password" 
                placeholder="كلمة المرور" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ padding: '10px', borderRadius: '6px', border: '1px solid #475569', background: '#0f172a', color: '#fff' }}
              />
              <button type="submit" disabled={loading} style={{ padding: '10px', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
                {loading ? 'جاري التنفيذ...' : (isLogin ? 'دخول' : 'تسجيل')}
              </button>
            </form>
            <p style={{ textAlign: 'center', marginTop: '15px', cursor: 'pointer', color: '#94a3b8' }} onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'ليس لديك حساب؟ اضغط هنا للتسجيل' : 'لديك حساب بالفعل؟ سجل دخولك'}
            </p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <p>مرحباً بك: <b>{user.email}</b></p>
              <button onClick={handleLogout} style={{ padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>تسجيل خروج</button>
            </div>
            
            <h3>المهام المتاحة للكسب:</h3>
            {tasks.length === 0 ? (
              <p style={{ color: '#94a3b8' }}>لا توجد مهام حالياً. سيتم إضافة مهام مشاهدة الإعلانات قريباً!</p>
            ) : (
              <ul>
                {tasks.map(task => (
                  <li key={task.id}>{task.title} - الأجر: {task.reward}$</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
