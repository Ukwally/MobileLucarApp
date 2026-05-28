import sys
import json
import cv2
from ultralytics import YOLO

def detectar_matricula(caminho_imagem):
    try:
        # Carrega o modelo YOLO para detetar matrículas
        model = YOLO('models/license_plate_detector.pt') 
        
        # Executa a deteção na imagem recebida
        resultados = model(caminho_imagem, verbose=False)
        
        # Carregar imagem
        imagem = cv2.imread(caminho_imagem)
        if imagem is None:
            return {"success": False, "error": "Não foi possível carregar a imagem."}
        
        # Procura apenas a primeira placa
        for resultado in resultados:
            for box in resultado.boxes:
                # Obter coordenadas da placa
                x1, y1, x2, y2 = map(int, box.xyxy[0])
                confianca = float(box.conf[0])
                
                # Recortar apenas a região da placa
                placa_recortada = imagem[y1:y2, x1:x2]
                
                if placa_recortada.size == 0:
                    continue
                
                # Salvar apenas a imagem da placa (não a imagem inteira)
                cv2.imwrite('placa_detectada.jpg', placa_recortada)
                
                # Retorna apenas a placa recortada
                return {
                    "success": True,
                    "mensagem": "Placa detetada com sucesso",
                    "confianca": confianca,
                    "arquivo_placa": "placa_detectada.jpg",
                    "coordenadas": [x1, y1, x2, y2],
                    "dimensoes": {
                        "largura": x2 - x1,
                        "altura": y2 - y1
                    }
                }
        
        # Se nenhuma placa foi encontrada
        return {"success": False, "error": "Nenhuma placa detetada na imagem."}
            
    except Exception as e:
        return {"success": False, "error": str(e)}

if __name__ == "__main__":
    # Recebe o caminho da imagem enviado pelo Node.js como argumento
    if len(sys.argv) > 1:
        caminho = sys.argv[1]
        resultado = detectar_matricula(caminho)
        print(json.dumps(resultado))
    else:
        print(json.dumps({"success": False, "error": "Nenhum caminho de imagem fornecido."}))