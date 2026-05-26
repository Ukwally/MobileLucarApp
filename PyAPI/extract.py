import cv2
from ultralytics import YOLO
import easyocr

# ---- PASSO 1: Carregar os Modelos de IA ----
# Carrega o modelo YOLO específico para detetar matrículas/placas
modelo_detecao = YOLO('yolov8n-license-plate.pt') 
# Inicializa o leitor de texto (OCR) configurado para português/inglês
leitor_texto = easyocr.Reader(['pt', 'en'])

# ---- PASSO 2: Carregar a Imagem ----
caminho_imagem = 'carro.jpg'
imagem = cv2.imread(caminho_imagem)

# ---- PASSO 3: Detetar a Localização da Placa ----
resultados = modelo_detecao(imagem)[0]

for box in resultados.boxes.data.tolist():
    # Coordenadas da caixa delimitadora da placa
    x1, y1, x2, y2, score, class_id = box
    
    # ---- PASSO 4: Recortar e Filtrar a Placa ----
    # Recorta apenas a região da placa da imagem original
    placa_recortada = imagem[int(y1):int(y2), int(x1):int(x2)]
    
    # Converter para escala de cinzentos para facilitar a leitura do OCR
    placa_cinza = cv2.cvtColor(placa_recortada, cv2.COLOR_BGR2GRAY)
    
    # ---- PASSO 5: Ler o Texto da Placa ----
    resultado_ocr = leitor_texto.readtext(placa_cinza)
    
    for (bbox, texto, probabilidade) in resultado_ocr:
        if probabilidade > 0.4: # Filtra leituras com pouca confiança
            print(f"Placa Detetada: {texto.upper()} (Confiança: {probabilidade:.2f})")
