import  React , {useState} from "react";

function Login( {onLogin})
{
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = (e) => {
        e.preventDefault();
        if(username && password) {
            onLogin(username, password);
        }
    }

    return (
        <div className="h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2x1 shadow-lg w-80">
                <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
                <form onSubmit={handleLogin} className="flex flex-col gap-4">
                    <input type="text" placeholder="Username" className="p-2 border rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
                    <input type="password" placeholder="Password" className="p-2 border rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <button type="submit" className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition">Login</button>
                </form>
            </div>
        </div>
    );
}

export default Login;