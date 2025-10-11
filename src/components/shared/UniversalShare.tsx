import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Share2, FileText, Table, Mail, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UniversalShareProps {
  onExportPDF?: () => void;
  onExportExcel?: () => void;
  onShareEmail?: () => void;
  onUploadInvoice?: () => void;
}

export const UniversalShare = ({
  onExportPDF,
  onExportExcel,
  onShareEmail,
  onUploadInvoice,
}: UniversalShareProps) => {
  const { toast } = useToast();

  const handleAction = (action: () => void | undefined, actionName: string) => {
    if (action) {
      action();
    } else {
      toast({
        title: "Coming Soon",
        description: `${actionName} feature will be available soon.`,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="default" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share & Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={() => handleAction(onExportPDF, "Export PDF")}>
          <FileText className="mr-2 h-4 w-4" />
          Export as PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onExportExcel, "Export Excel")}>
          <Table className="mr-2 h-4 w-4" />
          Export as Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleAction(onShareEmail, "Share Email")}>
          <Mail className="mr-2 h-4 w-4" />
          Share via Email
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleAction(onUploadInvoice, "Upload Invoice")}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Invoice
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
