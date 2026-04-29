import { useEffect, useState } from 'react'

const API_BASE = 'http://localhost:3000'

export function useCarteira(): Record<string, number> {

    const [state, setState] = useState<Record<string, number>>({})

    useEffect(() => {
        fetch(`${API_BASE}/regioes/carteira`)
        .then(res => {
            if (!res.ok) throw new Error('Erro ao acessar a carteira dos estados')
            return res.json()                
        })
        .then((data) => {

            const dataMap = Object.fromEntries(
                Object.entries(data).map(([key, value]) => [key, Number(value)])
            )

            setState(dataMap)
        })
        .catch(err => {
            console.error("Erro no hook useCarteira: ", err)
            setState({})
        })

    }, [])

    return state
}