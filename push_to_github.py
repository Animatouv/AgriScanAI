import tkinter as tk
from tkinter import simpledialog, messagebox
import subprocess
import os

def get_token():
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    
    token = simpledialog.askstring(
        "GitHub PAT Required", 
        "Enter your GitHub Personal Access Token (PAT):", 
        show="*"
    )
    root.destroy()
    return token

def run_git_command(args, cwd):
    # Hide console window on Windows if running in background
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    res = subprocess.run(args, cwd=cwd, capture_output=True, text=True, startupinfo=startupinfo)
    return res

def main():
    workspace_dir = r"c:\Users\srinu\OneDrive\Desktop\hackathon1\agrosencetest-main\agrosencetest-main"
    git_exe = os.path.join(workspace_dir, ".git_portable", "cmd", "git.exe")
    
    if not os.path.exists(git_exe):
        # Fallback to system git if portable git doesn't exist
        git_exe = "git"
        
    token = get_token()
    if not token:
        print("No token entered. Aborting.")
        return
        
    # Add remote
    print("Setting remote URL...")
    remote_url_with_token = f"https://{token}@github.com/Animatouv/AgriScanAI.git"
    run_git_command([git_exe, "remote", "set-url", "origin", remote_url_with_token], workspace_dir)
    
    print("Pushing to GitHub...")
    res = run_git_command([git_exe, "push", "-u", "origin", "main"], workspace_dir)
    
    # Clean up token
    print("Cleaning up remote URL...")
    run_git_command([git_exe, "remote", "set-url", "origin", "https://github.com/Animatouv/AgriScanAI.git"], workspace_dir)
    
    root = tk.Tk()
    root.withdraw()
    root.attributes('-topmost', True)
    if res.returncode == 0:
        messagebox.showinfo("Success", "Code successfully pushed to GitHub repository!")
        print("Push successful!")
    else:
        error_msg = res.stderr or res.stdout
        messagebox.showerror("Error", f"Failed to push to GitHub:\n{error_msg}")
        print(f"Push failed: {error_msg}")
    root.destroy()

if __name__ == "__main__":
    main()
