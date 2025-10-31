import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Download, Trash2, Home, ChartLine } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SavedReport {
  id: string;
  report_name: string;
  report_type: string;
  created_at: string;
  model_id: string | null;
  report_data: any;
}

export default function Reports() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const fromModelId = searchParams.get("modelId");
  const [reports, setReports] = useState<SavedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reportToDelete, setReportToDelete] = useState<string | null>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to view reports");
        navigate("/auth");
        return;
      }

      const { data, error } = await supabase
        .from("forecast_reports")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Error loading reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  };

  const downloadReport = (report: SavedReport) => {
    try {
      const blob = new Blob([JSON.stringify(report.report_data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${report.report_name.replace(/[^a-z0-9]/gi, "_")}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      toast.success("Report downloaded");
    } catch (error) {
      console.error("Error downloading report:", error);
      toast.error("Failed to download report");
    }
  };

  const confirmDelete = (reportId: string) => {
    setReportToDelete(reportId);
    setDeleteDialogOpen(true);
  };

  const deleteReport = async () => {
    if (!reportToDelete) return;

    try {
      const { error } = await supabase
        .from("forecast_reports")
        .delete()
        .eq("id", reportToDelete);

      if (error) throw error;

      setReports(reports.filter((r) => r.id !== reportToDelete));
      toast.success("Report deleted");
    } catch (error) {
      console.error("Error deleting report:", error);
      toast.error("Failed to delete report");
    } finally {
      setDeleteDialogOpen(false);
      setReportToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center text-muted-foreground">Loading reports...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
          <Home className="h-4 w-4 mr-2" />
          Forecasting
        </Button>
        {fromModelId && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/?modelId=${fromModelId}#results`)}
          >
            <ChartLine className="h-4 w-4 mr-2" />
            Back to Results
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Saved Reports
          </CardTitle>
          <CardDescription>
            View and manage your exported forecast reports with configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No saved reports yet. Export a report from your forecast results to see it here.
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <Card key={report.id} className="border">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="text-base">{report.report_name}</CardTitle>
                        <CardDescription>
                          Generated: {new Date(report.created_at).toLocaleString()}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">{report.report_type}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadReport(report)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => confirmDelete(report.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Report</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this report? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={deleteReport}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}