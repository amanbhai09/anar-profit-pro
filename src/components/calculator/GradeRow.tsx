import { useState } from "react";
import { Trash2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GradeData } from "@/types/calculator";
import { toast } from "sonner";

interface GradeRowProps {
  grade: GradeData;
  onUpdate: (grade: GradeData) => void;
  onRemove: (id: string) => void;
  isHighest?: boolean;
  isLowest?: boolean;
}

export const GradeRow = ({ grade, onUpdate, onRemove, isHighest, isLowest }: GradeRowProps) => {
  const [localGrade, setLocalGrade] = useState(grade);

  const handleChange = (field: keyof GradeData, value: string | number) => {
    const updatedGrade = { ...localGrade, [field]: value };
    
    if (field === 'boxes' || field === 'rate') {
      const boxes = Number(updatedGrade.boxes) || 0;
      const rate = Number(updatedGrade.rate) || 0;
      updatedGrade.gross = boxes * rate;
    }
    
    setLocalGrade(updatedGrade);
    onUpdate(updatedGrade);
  };

  const handleCopyValues = () => {
    const text = `Grade: ${grade.note}, Boxes: ${grade.boxes}, Rate: ₹${grade.rate}, Gross: ₹${grade.gross.toLocaleString('en-IN')}`;
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Grade values copied to clipboard!");
    }).catch(() => {
      toast.error("Failed to copy values");
    });
  };

  const rowClass = `
    ${isHighest ? 'bg-success/10 border-success/30' : ''}
    ${isLowest ? 'bg-destructive/10 border-destructive/30' : ''}
    ${!isHighest && !isLowest ? 'border-border/50' : ''}
    border rounded-lg p-4 transition-all duration-300 hover:shadow-md
  `;

  return (
    <div className={rowClass}>
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center">
        <div className="md:col-span-2">
          <Input
            placeholder="Grade name (e.g., 4 dana)"
            value={localGrade.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="bg-background/50"
          />
        </div>
        
        <div>
          <Input
            type="number"
            placeholder="Boxes"
            value={localGrade.boxes || ''}
            onChange={(e) => handleChange('boxes', Number(e.target.value))}
            className="bg-background/50"
            min="0"
          />
        </div>
        
        <div>
          <Input
            type="number"
            placeholder="Rate/box"
            value={localGrade.rate || ''}
            onChange={(e) => handleChange('rate', Number(e.target.value))}
            className="bg-background/50"
            min="0"
          />
        </div>
        
        <div className="text-right font-mono font-medium">
          ₹{localGrade.gross.toLocaleString('en-IN')}
          {isHighest && (
            <div className="text-xs text-success font-medium mt-1">
              Best Grade
            </div>
          )}
          {isLowest && (
            <div className="text-xs text-destructive font-medium mt-1">
              Lowest Grade
            </div>
          )}
        </div>
        
        <div className="flex gap-2 justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyValues}
            className="btn-ghost-elegant"
          >
            <Copy className="w-4 h-4" />
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => onRemove(grade.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};