import { Link } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Твій системний шлях у трейдингу</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>Чеклісти, тренажери, симулятор, бектест і Web3-квести — все в одному місці.</p>
          <div className="flex gap-3">
            <Button asChild><Link to="/onboarding">Почати онбординг</Link></Button>
            <Button variant="secondary" asChild><Link to="/learn">Дорожня карта</Link></Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
