import os
import subprocess

def load_pat_and_clean_env():
    env_path = r"c:\Users\srinu\OneDrive\Desktop\hackathon1\agrosencetest-main\agrosencetest-main\.env"
    if not os.path.exists(env_path):
        print("Error: .env file not found.")
        return None
        
    token = None
    remaining_lines = []
    
    with open(env_path, 'r', encoding='utf-8') as f:
        for line in f:
            if line.strip().startswith("GITHUB_PAT="):
                token = line.strip().split("=", 1)[1].strip().strip('"').strip("'")
            else:
                remaining_lines.append(line)
                
    if not token:
        return None
        
    # Write back without GITHUB_PAT for security
    with open(env_path, 'w', encoding='utf-8') as f:
        f.writelines(remaining_lines)
        
    return token

def main():
    workspace_dir = r"c:\Users\srinu\OneDrive\Desktop\hackathon1\agrosencetest-main\agrosencetest-main"
    git_exe = os.path.join(workspace_dir, ".git_portable", "cmd", "git.exe")
    
    if not os.path.exists(git_exe):
        git_exe = "git"
        
    token = load_pat_and_clean_env()
    if not token:
        print("GITHUB_PAT not found in .env. Please add GITHUB_PAT=your_token to the root .env file.")
        return
        
    print("Setting remote URL with token...")
    remote_url_with_token = f"https://{token}@github.com/Animatouv/AgriScanAI.git"
    
    # Hide console window on Windows
    startupinfo = subprocess.STARTUPINFO()
    startupinfo.dwFlags |= subprocess.STARTF_USESHOWWINDOW
    
    subprocess.run([git_exe, "remote", "set-url", "origin", remote_url_with_token], cwd=workspace_dir, startupinfo=startupinfo)
    
    print("Pushing to GitHub...")
    res = subprocess.run([git_exe, "push", "-u", "origin", "main"], cwd=workspace_dir, capture_output=True, text=True, startupinfo=startupinfo)
    
    print("Cleaning up remote URL...")
    subprocess.run([git_exe, "remote", "set-url", "origin", "https://github.com/Animatouv/AgriScanAI.git"], cwd=workspace_dir, startupinfo=startupinfo)
    
    if res.returncode == 0:
        print("Success: Code successfully pushed to GitHub!")
    else:
        print("Error: Failed to push to GitHub.")
        print(res.stderr or res.stdout)

if __name__ == "__main__":
    main()
