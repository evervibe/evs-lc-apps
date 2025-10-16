import { Users, Swords, Trophy, Zap, Wallet, User, Clock, TrendingUp, Gift, Download, FileText, ExternalLink, Check, Plus, MessageSquare, ShoppingCart, ArrowLeft } from "@/lib/icons";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


// Mock data
const marketItems = [
  {
    id: 1,
    name: "Health Potion (100)",
    description: "Restores 500 HP instantly",
    price: 50,
    category: "Consumables",
  },
  {
    id: 2,
    name: "Mana Potion (100)",
    description: "Restores 500 MP instantly",
    price: 50,
    category: "Consumables",
  },
  {
    id: 3,
    name: "Premium Mount",
    description: "Increases movement speed by 50%",
    price: 500,
    category: "Mounts",
  },
  {
    id: 4,
    name: "Experience Boost (7 days)",
    description: "Gain 50% more experience for 7 days",
    price: 300,
    category: "Boosts",
  },
  {
    id: 5,
    name: "Costume: Dragon Warrior",
    description: "Exclusive cosmetic appearance",
    price: 800,
    category: "Cosmetics",
  },
  {
    id: 6,
    name: "Pet: Baby Dragon",
    description: "Cute companion that follows you",
    price: 600,
    category: "Pets",
  },
];

export default function MarketPage() {
  return (
    <div className="container mx-auto px-6 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Item Shop</h1>
        <p className="text-muted-foreground">
          Purchase items and upgrades to enhance your gaming experience
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {marketItems.map((item) => (
          <Card key={item.id}>
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-primary px-2 py-1 bg-primary/10 rounded">
                  {item.category}
                </span>
              </div>
              <CardTitle>{item.name}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-primary">
                  {item.price} Cash
                </span>
                <Button size="sm">
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
