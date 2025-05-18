from git_diff_parser import get_git_diff, extract_added_code
from review_chain import get_review_chain
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app) 

@app.route('/')
def index():
    return "Welcome to the Code Review API!"

@app.route('/review', methods=['POST'])
def review_code():
    data = request.json
    folder_path = data.get("folderPath")

    try:
        diff = get_git_diff(folder_path)
        code = extract_added_code(diff)

        if not code.strip():
            print("No staged code found.")
            return

        chain = get_review_chain()
        result = chain({"code": code})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

    return jsonify({
        "diff": diff,
        "reviews": {
            "architecture": result["architecture_review"],
            "security": result["security_review"],
            "productOwner": result["product_owner_review"]
    }
})

if __name__ == '__main__':
    app.run(port=5000)
