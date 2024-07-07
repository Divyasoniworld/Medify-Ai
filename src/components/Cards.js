import React from 'react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Activity, CreditCard, DollarSign, Users } from 'lucide-react'

const Cards = () => {
    return (
        <div className="grid gap-6 mt-10 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle className="text-md">What is Paracetamol and what is it used for?</CardTitle>
                </CardHeader>
            </Card>
            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle className="text-md">How does Ibuprofen work and when should I take it?</CardTitle>
                </CardHeader>
            </Card>
            <Card className="xl:col-span-1">
                <CardHeader>
                    <CardTitle className="text-md">What are the uses and side effects of Aspirin?</CardTitle>
                </CardHeader>
            </Card>
        </div>
    )
}

export default Cards