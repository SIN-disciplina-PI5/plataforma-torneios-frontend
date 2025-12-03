import { VStack, Text, Input, InputField, Button } from "@gluestack-ui/themed"
import { useState } from "react"
import { View } from "react-native"

export default function CriarTorneio() {
  const [nome, setNome] = useState("")
  const [categoria, setCategoria] = useState("")
  const [vagas, setVagas] = useState("")

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: "#fff" }}>
      <Text fontSize="$2xl" fontWeight="bold">Criar Torneio</Text>

      <VStack space="md" marginTop="$5">

        <VStack>
          <Text>Nome</Text>
          <Input>
            <InputField
              placeholder="Torneio de Verão"
              value={nome}
              onChangeText={setNome}
            />
          </Input>
        </VStack>

        <VStack>
          <Text>Categoria</Text>
          <Input>
            <InputField
              placeholder="Intermediário"
              value={categoria}
              onChangeText={setCategoria}
            />
          </Input>
        </VStack>

        <VStack>
            <Text>Vagas</Text>
            <Input>
                <InputField
                placeholder="0"
                keyboardType="numeric"
                inputMode="numeric"
                value={vagas}
                onChangeText={(text) => {
                    const somenteNumeros = text.replace(/[^0-9]/g, '')
                    setVagas(somenteNumeros)
                }}
                />
            </Input>
        </VStack>

        <Button backgroundColor="#37A51E" marginTop="$6">
          <Text color="#fff" fontWeight="bold">CRIAR</Text>
        </Button>

      </VStack>
    </View>
  )
}
