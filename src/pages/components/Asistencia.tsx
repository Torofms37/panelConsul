import { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/contaduria.css";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { SkeletonTable } from "./Skeleton";
import { useAuth } from "../../hooks/useAuth";

interface AttendanceRecord {
  _id: string;
  fullName: string;
  attendance: boolean[];
  activities: boolean[];
}

interface Group {
  _id: string;
  name: string;
  teacherName: string;
  students: unknown[];
  alerts?: number;
  news?: number;
}

export const Asistencia = () => {
  const { user } = useAuth();
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>("");
  const [students, setStudents] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch groups on mount
  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const token = localStorage.getItem("token");
        const endpoint =
          user.role === "admin"
            ? "http://localhost:5000/api/all-groups"
            : "http://localhost:5000/api/groups";

        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setGroups([...response.data]);
      } catch (err) {
        console.error("Error loading groups:", err);
      }
    };
    fetchGroups();
  }, [user.role]);

  // Fetch attendance when group is selected
  useEffect(() => {
    if (!selectedGroupId) return;

    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        console.log("Fetching attendance for group:", selectedGroupId);

        const response = await axios.get(
          `http://localhost:5000/api/groups/${selectedGroupId}/attendance`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        console.log("Attendance response:", response.data);
        console.log("Number of students:", response.data.length);

        setStudents(response.data);
      } catch (err) {
        console.error("Error al cargar la asistencia:", err);
        if (axios.isAxiosError(err)) {
          console.error("Response data:", err.response?.data);
          console.error("Response status:", err.response?.status);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, [selectedGroupId]);

  const handleCheck = (
    studentId: string,
    type: "attendance" | "activities",
    index: number
  ) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s._id === studentId) {
          const newArray = [...s[type]];
          newArray[index] = !newArray[index];
          return { ...s, [type]: newArray };
        }
        return s;
      })
    );
  };

  const handleDownload = () => {
    if (!students.length) return;

    const doc = new jsPDF({ orientation: "landscape" });

    // Title
    doc.setFontSize(18);
    doc.text(
      `Reporte de Asistencia: ${selectedGroup?.name || "Grupo"}`,
      14,
      22
    );

    // Subtitle
    doc.setFontSize(12);
    doc.setTextColor(100);
    doc.text(`Profesor: ${selectedGroup?.teacherName || "N/A"}`, 14, 30);
    doc.text(`Fecha de reporte: ${new Date().toLocaleDateString()}`, 14, 36);

    // Table Columns
    const tableColumn = [
      "Estudiante",
      ...Array.from({ length: 8 }, (_, i) => `Sesión ${i + 1}`),
      "Total Asist.",
      "Total Activ.",
    ];

    // Table Rows
    const tableRows = students.map((student) => {
      const rowData = [student.fullName];
      let totalAttendance = 0;
      let totalActivities = 0;

      for (let i = 0; i < 8; i++) {
        const attended = student.attendance[i];
        const activity = student.activities[i];

        if (attended) totalAttendance++;
        if (activity) totalActivities++;

        rowData.push(`${attended ? "A" : "-"} / ${activity ? "T" : "-"}`);
      }

      rowData.push(totalAttendance.toString());
      rowData.push(totalActivities.toString());

      return rowData;
    });

    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 3,
        halign: "center",
        valign: "middle",
        lineColor: [200, 200, 200],
        lineWidth: 0.1,
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255,
        fontStyle: "bold",
        halign: "center",
      },
      columnStyles: {
        0: { halign: "left" },
      },
      alternateRowStyles: { fillColor: [241, 245, 249] },
      didDrawPage: () => {
        // Footer
        doc.setFontSize(8);
        doc.text(
          "A = Asistencia, T = Tarea/Actividad",
          14,
          doc.internal.pageSize.height - 10
        );
      },
    });

    doc.save(`Asistencia_${selectedGroup?.name || "Grupo"}.pdf`);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const payload = students.map((s) => ({
        studentId: s._id,
        attendance: s.attendance,
        activities: s.activities,
      }));

      await axios.post(
        `http://localhost:5000/api/groups/${selectedGroupId}/attendance`,
        { attendanceData: payload },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Cambios guardados correctamente.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar cambios.");
    } finally {
      setSaving(false);
    }
  };

  const selectedGroup = groups.find((g) => g._id === selectedGroupId);

  return (
    <div className="w-full h-auto bg-slate-900/50 p-4 md:p-8">
      <div className="section-header mb-8">
        <h2 className="section-title text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
          <span>📝</span> Asistencia y Actividades
        </h2>
        <p className="section-subtitle text-slate-400 mt-2 text-lg">
          {selectedGroupId
            ? `Gestionando: ${selectedGroup?.name}`
            : "Selecciona un grupo para comenzar"}
        </p>
      </div>

      {!selectedGroupId ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {groups.length === 0 ? (
            <div className="text-center p-12 bg-slate-800/50 rounded-3xl border border-slate-700/50 col-span-full backdrop-blur-sm">
              <p className="text-slate-400 text-xl">
                No tienes grupos asignados.
              </p>
            </div>
          ) : (
            groups.map((group) => (
              <div
                key={group._id}
                onClick={() => setSelectedGroupId(group._id)}
                className="group w-100 h-30  flex align-center justify-center relative rounded-[1rem] bg-slate-800/20 border border-slate-700/30 hover:bg-slate-800/40 hover:border-blue-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 cursor-pointer hover:-translate-y-2 flex flex-col"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-transparent to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500" />

                <div className="relative p-8 flex-1 flex flex-col">
                  {/* Header: Icon + Name */}
                  <div className="flex items-center gap-5 mb-6">
                    {/* Icon Container */}
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-blue-500/20 blur-lg rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 flex items-center justify-center text-3xl shadow-lg group-hover:scale-105 group-hover:border-blue-500/30 transition-all duration-500">
                        <span className="drop-shadow-md">📚</span>
                      </div>
                    </div>

                    {/* Course Name */}
                    <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight leading-tight capitalize pt-1">
                      {group.name.charAt(0).toUpperCase() +
                        group.name.slice(1).toLowerCase()}
                    </h3>
                  </div>

                  {/* Minimalist Stats - Justified */}
                  <div className="h-full flex items-center justify-between pt-6 border-t border-slate-700/30 mt-4 px-2">
                    <div className="flex items-center text-slate-400">
                      <div className="w-8 h-8 rounded-xl flex items-center justify-center text-lg">
                        👨‍🏫
                      </div>
                      <span className="text-xl font-extralight truncate max-w-[120px]">
                        {group.teacherName.split(" ")[0]}
                      </span>
                    </div>

                    <div className="flex items-center text-slate-400">
                      <span className="text-xl font-extralight">
                        {group.students?.length || 0} alumnos
                      </span>
                      <div className="w-8 h-8 rounded-full  flex items-center justify-center text-sm">
                        👥
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <>
          <div className="flex justify-start mb-12">
            <button
              onClick={() => setSelectedGroupId("")}
              className="group flex items-center gap-2 w-45 justify-center h-10 bg-slate-800/50 text-slate-400 rounded-xl hover:bg-slate-800 hover:text-white transition-all duration-300 border border-slate-700/50 hover:border-slate-600 hover:cursor-pointer"
            >
              <svg
                className="w-5 h-5 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              <span>Volver a Grupos</span>
            </button>
          </div>

          {loading ? (
            <SkeletonTable rows={5} columns={9} />
          ) : (
            <>
              <div className="relative top-6 flex flex-col gap-6 p-6 md:p-8 bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-700/50">
                {/* Decorative Background Elements */}
                <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none "></div>
                <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

                {/* Header Section */}
                <div className="relative z-10 p-6 mb-6 bg-slate-800/40 rounded-2xl border border-slate-700/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-2xl shadow-lg shadow-blue-500/20 transform -rotate-3">
                        📚
                      </span>
                      <div>
                        <h3 className="text-3xl font-bold text-white tracking-tight">
                          {selectedGroup?.name}
                        </h3>
                        <p className="text-slate-400 font-medium flex items-center gap-2 text-sm mt-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.5)]"></span>
                          Profesor:{" "}
                          <span className="text-slate-200">
                            {selectedGroup?.teacherName}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="px-6 py-3 rounded-2xl bg-slate-800/80 border border-slate-700/50 flex flex-col items-center min-w-[140px] shadow-xl">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
                        Total Alumnos
                      </span>
                      <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                        {students.length}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Table Section */}
                <div className="relative z-10 rounded-2xl border border-slate-700/50 bg-slate-800/20 mb-6">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-slate-800/80 border-b border-slate-700/50">
                          <th className="text-center text-xs font-bold text-slate-300 uppercase tracking-wider sticky left-0 bg-slate-800 z-20 shadow-[4px_0_24px_rgba(0,0,0,0.2)] min-w-[220px]">
                            Estudiante
                          </th>
                          {[...Array(8)].map((_, i) => (
                            <th
                              key={i}
                              className="px-2 py-2 text-center min-w-[120px]"
                            >
                              <div className="inline-flex flex-col items-center justify-center">
                                <span className="text-xs font-bold text-slate-400 mb-2 bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600/50">
                                  SESIÓN {i + 1}
                                </span>
                                <div className="flex gap-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                  <span className="text-blue-400/70">Asis</span>
                                  <span className="text-emerald-400/70">
                                    Act
                                  </span>
                                </div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-700/30">
                        {students.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="px-6 py-24 text-center">
                              <div className="flex flex-col items-center justify-center gap-6 opacity-50">
                                <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center text-5xl shadow-inner">
                                  👥
                                </div>
                                <p className="text-slate-400 text-xl font-medium">
                                  No hay alumnos registrados aún.
                                </p>
                              </div>
                            </td>
                          </tr>
                        ) : (
                          students.map((student, idx) => (
                            <tr
                              key={student._id}
                              className="group hover:bg-slate-800/40 transition-colors duration-200"
                            >
                              <td className="px-6 py-4 sticky left-0 bg-slate-900/95 group-hover:bg-slate-800/95 transition-colors duration-200 z-10 border-r border-slate-700/50 shadow-[4px_0_24px_rgba(0,0,0,0.2)]">
                                <div className="flex items-center gap-4">
                                  <span className="relative left-1 flex-shrink-0 w-8 h-8 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center text-xs font-bold border border-slate-700 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                                    {idx + 1}
                                  </span>
                                  <span className="font-semibold text-slate-200 group-hover:text-white transition-colors text-base">
                                    {student.fullName}
                                  </span>
                                </div>
                              </td>
                              {(student.attendance || []).map((attended, i) => (
                                <td key={i} className="px-2">
                                  <div className="flex items-center justify-center gap-2">
                                    {/* Attendance Toggle */}
                                    <button
                                      onClick={() =>
                                        handleCheck(
                                          student._id,
                                          "attendance",
                                          i
                                        )
                                      }
                                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group/btn ${
                                        attended
                                          ? "bg-blue-500 shadow-lg shadow-blue-500/30 translate-y-0"
                                          : "bg-slate-800/50 border border-slate-700 hover:border-blue-500/50 hover:bg-slate-700"
                                      }`}
                                      title="Marcar Asistencia"
                                    >
                                      <span
                                        className={`text-lg transition-transform duration-300 ${
                                          attended
                                            ? "scale-100 text-white"
                                            : "scale-0"
                                        }`}
                                      >
                                        ✓
                                      </span>
                                      {!attended && (
                                        <span className="absolute text-[10px] font-bold text-slate-600 group-hover/btn:text-blue-400/50 transition-colors">
                                          A
                                        </span>
                                      )}
                                    </button>

                                    {/* Activity Toggle */}
                                    <button
                                      onClick={() =>
                                        handleCheck(
                                          student._id,
                                          "activities",
                                          i
                                        )
                                      }
                                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 group/btn ${
                                        (student.activities || [])[i]
                                          ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 translate-y-0"
                                          : "bg-slate-800/50 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700"
                                      }`}
                                      title="Marcar Actividad"
                                    >
                                      <span
                                        className={`text-lg transition-transform duration-300 ${
                                          (student.activities || [])[i]
                                            ? "scale-100 text-white"
                                            : "scale-0"
                                        }`}
                                      >
                                        ★
                                      </span>
                                      {!(student.activities || [])[i] && (
                                        <span className="absolute text-[10px] font-bold text-slate-600 group-hover/btn:text-emerald-400/50 transition-colors">
                                          T
                                        </span>
                                      )}
                                    </button>
                                  </div>
                                </td>
                              ))}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Footer Actions with Tip - Unified Design */}
                <div className="relative z-10 p-6 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    {/* Legend */}
                    <div className="flex items-center gap-6 text-sm text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></span>
                        <span>Asistencia</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
                        <span>Actividad</span>
                      </div>
                    </div>

                    {/* Separator */}
                    <div className="hidden md:block w-px h-8 bg-slate-700/50"></div>

                    {/* Tip */}
                    <div className="flex items-center gap-2 text-slate-300 text-sm">
                      <span className="text-xl">💡</span>
                      <p>
                        Tip: Haz clic en{" "}
                        <strong className="text-blue-400">A</strong> para
                        asistencia y{" "}
                        <strong className="text-emerald-400">T</strong> para
                        tareas/actividades.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Download Button Section */}
                <div className="relative z-10 mt-6 flex justify-center">
                  <button
                    onClick={handleDownload}
                    className="w-60 h-10 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold shadow-lg shadow-blue-500/20 hover:shadow-blue-500/40 hover:from-blue-400 hover:to-indigo-500 transition-all duration-300 transform hover:-translate-y-0.5 tracking-wide flex items-center justify-center text-lg gap-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Descargar Reporte</span>
                  </button>
                </div>
              </div>

              {/* Floating Save Button Area */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="top-25 w-60 h-10 fixed rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:from-emerald-400 hover:to-teal-500 transition-all duration-300 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed tracking-wide flex items-center justify-center text-lg"
                >
                  {saving ? (
                    <>
                      <svg
                        className="animate-spin h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span>Guardando...</span>
                    </>
                  ) : (
                    "Guardar Cambios"
                  )}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
