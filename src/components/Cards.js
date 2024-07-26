import React, { useContext } from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'
import { Context } from "@/context/ContextProvider";

const cardsNames = [
    {
        value: "What is Paracetamol and what is it used for?"
    },
    {
        value: "How does Ibuprofen work and when should I take it?"
    },
    {
        value: "What are the uses and side effects of Aspirin?"
    }
]

const Cards = () => {

    const { setInput } = useContext(Context)

    return (
        <div className="grid gap-6 mt-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            {
                cardsNames.map((card, index) => {
                    return (
                        <Card className="xl:col-span-1 " key={index} >
                            <CardHeader className="h-full w-full bg-gray-300 rounded-md bg-clip-padding backdrop-filter backdrop-blur-3xl backdrop-brightness-100 bg-opacity-15">
                                <CardTitle className="text-md cursor-pointer" onClick={()=>{setInput(card?.value)}} >{card?.value}</CardTitle>
                            </CardHeader>
                        </Card>
                    )
                })
            }
        </div>
    )
}

export default Cards