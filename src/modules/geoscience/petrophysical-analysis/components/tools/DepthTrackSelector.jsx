import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const DepthTrackSelector = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Depth Track</CardTitle>
      </CardHeader>
      <CardContent>
        <Label>Select Depth Track</Label>
        <Select defaultValue="md">
            <SelectTrigger>
                <SelectValue placeholder="Select depth track" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="md">Measured Depth (MD)</SelectItem>
                <SelectItem value="tvd">True Vertical Depth (TVD)</SelectItem>
            </SelectContent>
        </Select>
      </CardContent>
    </Card>
  );
};

export default DepthTrackSelector;