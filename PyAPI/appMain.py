import cv2
import numpy as np

# Carregar o classificador treinado para placas russas
plate_cascade = cv2.CascadeClassifier('haarcascade_russian_plate_number.xml')

# Verificar se o classificador foi carregado corretamente
if plate_cascade.empty():
    print("Erro: Não foi possível carregar o arquivo XML.")
    print("Certifique-se de que o arquivo está no diretório correto.")
    exit()

# Carregar a imagem de teste
# Substitua 'placa_carro.jpg' pelo caminho da sua imagem
img = cv2.imread('imagem/matricola.jpg')

if img is None:
    print("Erro: Não foi possível carregar a imagem.")
    print("Verifique o caminho do arquivo.")
    exit()

# Converter para escala de cinza (necessário para o Haar Cascade)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Detectar placas na imagem
# Parâmetros: escala, vizinhos mínimos
plates = plate_cascade.detectMultiScale(
    gray,
    scaleFactor=1.05,      # Redução de escala a cada iteração
    minNeighbors=1,       # 3 Quantidade mínima de vizinhos
    minSize=(50, 20)      # Tamanho mínimo da placa
)

# Mostrar resultados
print(f"Total de placas detectadas: {len(plates)}")


# Verificar se alguma placa foi detectada
if len(plates) > 0:
    # PLACA DETECTADA: salvar apenas a região da placa
    print("\n✅ Placa(s) detectada(s)! Salvando apenas a(s) região(ões) da placa...")
    
    for i, (x, y, w, h) in enumerate(plates):
        # Recortar a região da placa da imagem ORIGINAL
        placa_recortada = img[y:y+h, x:x+w]
        
        # Salvar a placa recortada como um arquivo separado
        nome_arquivo = f'placa_detectada_{i+1}.jpg'
        cv2.imwrite(nome_arquivo, placa_recortada)
        print(f"  → Placa {i+1} salva como '{nome_arquivo}' - Coordenadas: x={x}, y={y}, w={w}, h={h}")
        
        # Opcional: Mostrar cada placa recortada em uma janela separada
        cv2.imshow(f'Placa Detectada {i+1}', placa_recortada)

else:
    # NENHUMA PLACA DETECTADA: salvar a imagem original
    print("\n❌ Nenhuma placa detectada! Salvando a imagem original como resultado...")
    cv2.imwrite('resultado_deteccao.jpg', img)
    print("  → Imagem original salva como 'resultado_deteccao.jpg'")
    
    # Mostrar mensagem na imagem
    img_com_mensagem = img.copy()
    cv2.putText(img_com_mensagem, 'Nenhuma placa detectada', (50, 50), 
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)
    cv2.imshow('Resultado - Nenhuma Placa', img_com_mensagem)

# Aguardar tecla para fechar
print("\nPressione qualquer tecla para fechar as janelas...")
cv2.waitKey(0)
cv2.destroyAllWindows()