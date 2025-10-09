import { useState } from "react";
import { Button } from "./button";
import { Input } from "./input";
import { Plus, Trash2, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

interface TradeRow {
  id: string;
  grade: string;
  box: string;
  price: string;
  col1: string;
  col2: string;
  col3: string;
  col4: string;
  col5: string;
}

export const RealTradeSection = () => {
  const [rows, setRows] = useState<TradeRow[]>([
    { id: '1', grade: '12D', box: '', price: '', col1: '', col2: '', col3: '', col4: '', col5: '' }
  ]);

  const addRow = () => {
    const newRow: TradeRow = {
      id: Date.now().toString(),
      grade: '',
      box: '',
      price: '',
      col1: '',
      col2: '',
      col3: '',
      col4: '',
      col5: ''
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const clearAll = () => {
    setRows([{ id: '1', grade: '12D', box: '', price: '', col1: '', col2: '', col3: '', col4: '', col5: '' }]);
  };

  const updateRow = (id: string, field: keyof TradeRow, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Real Trade - Grade Data</CardTitle>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={addRow}>
            <Plus className="h-4 w-4 mr-1" />
            Add Row
          </Button>
          <Button variant="outline" size="sm" onClick={clearAll}>
            <X className="h-4 w-4 mr-1" />
            Clear All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-24">Grade</TableHead>
                <TableHead className="w-24">Box</TableHead>
                <TableHead className="w-24">Price</TableHead>
                <TableHead className="w-24">Field 1</TableHead>
                <TableHead className="w-24">Field 2</TableHead>
                <TableHead className="w-24">Field 3</TableHead>
                <TableHead className="w-24">Field 4</TableHead>
                <TableHead className="w-24">Field 5</TableHead>
                <TableHead className="w-16">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>
                    <Input
                      value={row.grade}
                      onChange={(e) => updateRow(row.id, 'grade', e.target.value)}
                      placeholder="12D"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.box}
                      onChange={(e) => updateRow(row.id, 'box', e.target.value)}
                      placeholder="0"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      value={row.price}
                      onChange={(e) => updateRow(row.id, 'price', e.target.value)}
                      placeholder="0"
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.col1}
                      onChange={(e) => updateRow(row.id, 'col1', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.col2}
                      onChange={(e) => updateRow(row.id, 'col2', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.col3}
                      onChange={(e) => updateRow(row.id, 'col3', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.col4}
                      onChange={(e) => updateRow(row.id, 'col4', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={row.col5}
                      onChange={(e) => updateRow(row.id, 'col5', e.target.value)}
                      className="h-8"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(row.id)}
                      disabled={rows.length === 1}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
