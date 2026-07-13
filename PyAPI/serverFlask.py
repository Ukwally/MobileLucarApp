from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/detect', methods=['POST'])
def detect():

    image = request.files['image']

    caminho = "temp.jpg"

    image.save(caminho)

    resultado = detectar_matricula(caminho)

    return jsonify(resultado)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)