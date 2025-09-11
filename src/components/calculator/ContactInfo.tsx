import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { User, Phone, FileText, Hash } from "lucide-react";

interface ContactInfoProps {
  farmerName: string;
  buyerName: string;
  farmerContact: string;
  buyerContact: string;
  tripId: string;
  notes: string;
  onUpdate: (field: string, value: string) => void;
}

export const ContactInfo = ({
  farmerName,
  buyerName,
  farmerContact,
  buyerContact,
  tripId,
  notes,
  onUpdate
}: ContactInfoProps) => {
  return (
    <Card className="card-elegant">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-semibold">
          <User className="w-5 h-5 text-primary" />
          Transaction Details
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="farmerName" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-success" />
              Farmer Name (Kissan)
            </Label>
            <Input
              id="farmerName"
              placeholder="Enter farmer name"
              value={farmerName}
              onChange={(e) => onUpdate('farmerName', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buyerName" className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              Buyer Name (Vyapari)
            </Label>
            <Input
              id="buyerName"
              placeholder="Enter buyer name"
              value={buyerName}
              onChange={(e) => onUpdate('buyerName', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="farmerContact" className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-success" />
              Farmer Contact
            </Label>
            <Input
              id="farmerContact"
              placeholder="Phone number"
              value={farmerContact}
              onChange={(e) => onUpdate('farmerContact', e.target.value)}
              className="bg-background/50"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="buyerContact" className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary" />
              Buyer Contact
            </Label>
            <Input
              id="buyerContact"
              placeholder="Phone number"
              value={buyerContact}
              onChange={(e) => onUpdate('buyerContact', e.target.value)}
              className="bg-background/50"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="tripId" className="text-sm font-medium flex items-center gap-2">
            <Hash className="w-4 h-4 text-warning" />
            Trip/Batch ID
          </Label>
          <Input
            id="tripId"
            placeholder="Enter trip or batch reference"
            value={tripId}
            onChange={(e) => onUpdate('tripId', e.target.value)}
            className="bg-background/50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="notes" className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4 text-muted-foreground" />
            Notes & Comments
          </Label>
          <Textarea
            id="notes"
            placeholder="Add any special instructions, market conditions, or remarks..."
            value={notes}
            onChange={(e) => onUpdate('notes', e.target.value)}
            className="bg-background/50 min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  );
};