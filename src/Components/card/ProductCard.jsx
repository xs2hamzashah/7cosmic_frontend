import { Building, PhoneIcon as WhatsApp } from "lucide-react";
import { Card } from "../../core/shadcn/Card";
import { Badge } from "../../core/shadcn/Badge";

export default function ProductCard({ item }) {
  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(1)}Cr`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(1)}Lac`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(1)}k`;
    }
    return price;
  };

  return (
    <Card className="w-full max-w-md overflow-hidden bg-white/90 border-0 p-3">
      <div className="aspect-square relative mb-4 rounded-md overflow-hidden">
        <img
          // src="/solar_energy_director.jpeg"
          src={
            item.images.find((image) => image.is_display_image)?.image ||
            item.images[0].image
          }
          alt="Decorative solar design"
          className="w-full h-full object-cover rounded-lg min-h-[16.6rem]"
        />
      </div>

      <div className="space-y-4">
        {/*  */}
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-medium tracking-tighter">
             
              {item.display_name}
            </h2>
            <p className="text-gray-400 text-xl">Solar Solution</p>
            <div className="flex items-center gap-2 mt-2">
              <Building className="w-5 h-5 " />
              <span className="font-normal"> {item.company.name}</span>
            </div>
          </div>
          <div className="text-lg font-semibold">{formatPrice(item.price)}</div>
        </div>

        <Badge variant="secondary" className="bg-black/10  hover:bg-white/20">
          SUKKUR
        </Badge>

        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://wa.me/+1234567890"
          className="flex items-center p-2 justify-center gap-2 w-full bg-[#25d366] hover:bg-[#25d366]/90 text-white rounded-lg font-medium transition-colors"
        >
          <WhatsApp className="w-5 h-5" />
          WhatsApp
        </a>
      </div>
    </Card>
  );
}
