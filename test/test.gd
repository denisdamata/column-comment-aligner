# Teste 1: Comentário em linha isolada (não deve ser alterado) 
# Este é um comentário sozinho
 
# Teste 2: String com # em aspas duplas
var str1 = "Isso # não é um comentário" # Este é um comentário
 
# Teste 3: String com # em aspas simples
var str2 = 'Isso # não é um comentário' # Este é um comentário
 
# Teste 4: Aspas duplas escapadas e # dentro da string
var str3 = "Isso é uma \"#\" dentro de aspas" # Comentário aqui
 
# Teste 5: Aspas simples escapadas e # dentro da string
var str4 = 'Isso é uma \'#\' dentro de aspas' # Comentário aqui
 
# Teste 6: Múltiplos # na mesma linha (só o último é comentário)
var str5 = "Primeiro # não comentário" # Segundo # comentário
 
# Teste 7: String vazia
var str6 = "" # Comentário após string vazia
 
# Teste 8: String com apenas #
var str7 = "#" # Comentário aqui
 
# Teste 9: String iniciando com #
var str8 = "# Isso é uma string" # Comentário aqui
 
# Teste 10: String multi-line (com #)
var str9 = """
Isso é uma string multi -line com # não comentário
""" # Comentário após multi-line
 
# Teste 11: Código com # dentro de string e comentário real
func _ready():
	print("Cuidado com # em strings") # Imprime uma mensagem
       
func breakSprite(): 
	for piece in pieces.size():
		var pieceInstance = boxPieces.instantiate() # Uma instância para cada peça.
		get_parent().add_child(pieceInstance) # `pieceInstance` é um `RigidBody2D` com vários filhos.

