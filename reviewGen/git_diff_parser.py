import subprocess

def get_git_diff(folder_path):
    result = subprocess.run(
        ["git", "diff", "--staged"],
        cwd=folder_path,
        capture_output=True,
        text=True,
        check=True
    )
    return result.stdout

def extract_added_code(diff_text):
    code_lines = []
    for line in diff_text.splitlines():
        if line.startswith("+") and not line.startswith("+++"):
            code_lines.append(line[1:])  # '+' işaretini kaldır
    return "\n".join(code_lines)
