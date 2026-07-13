#este codico foi criado para usar o modelo de identificação apenas de placas, para identificar e recortar automáticamente antes do OCR
import cv2
# Carregar classificador
plate_cascade = cv2.CascadeClassifier('models/haarcascade_russian_plate_number.xml')

if plate_cascade.empty():
    print("Erro: XML não encontrado.")
    exit()

# Carregar imagem
img = cv2.imread('imagem/matricola2.jpg')

if img is None:
    print("Erro: Imagem não encontrada.")
    exit()

# Detectar placas
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
plates = plate_cascade.detectMultiScale(gray, 1.05, 1, minSize=(50, 20))

print(f"Total de placas detectadas: {len(plates)}")

# Lógica principal: salvar área detectada OU imagem original
if len(plates) > 0:
    print("✅ Placa detectada! Salvando apenas a primeira placa...")
    
    # Pega apenas a primeira placa (índice 0)
    x, y, w, h = plates[0]
    
    # Recortar a região da placa
    placa_recortada = img[y:y+h, x:x+w]
    
    # Salvar como um único arquivo
    cv2.imwrite('placa_detectada.jpg', placa_recortada)
    print(f"  → Salvo: placa_detectada.jpg - Coordenadas: x={x}, y={y}, w={w}, h={h}")
    
else:
    print("❌ Nenhuma placa detectada! Salvando imagem original...")
    cv2.imwrite('resultado_deteccao.jpg', img)
    print("  → Salvo: resultado_deteccao.jpg")
