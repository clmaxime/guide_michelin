import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function DishCard() {
  return (
    <Card className="max-w-[30rem] rounded-2xl shadow-[0_12px_30px_rgba(17,17,17,0.12)]">
      <CardHeader className="pb-3">
        <Badge className="w-fit rounded-md uppercase tracking-[0.08em]">Feature future</Badge>
        <CardTitle>Tinder des plats</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Carte placeholder prete pour brancher les donnees et le swipe.</p>
      </CardContent>
    </Card>
  );
}

export default DishCard;
