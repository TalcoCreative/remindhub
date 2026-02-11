export type LeadStatus =
  | 'new'
  | 'not_followed_up'
  | 'followed_up'
  | 'in_progress'
  | 'picked_up'
  | 'sign_contract'
  | 'completed'
  | 'lost'
  | 'cancelled';

export type LeadSource = 'whatsapp' | 'web' | 'instagram' | 'referral' | 'campaign' | 'partner' | 'manual';
export type LeadType = 'b2c' | 'b2b';

export interface Lead {
  id: string;
  name: string;
  phone: string;
  type: LeadType;
  company?: string;
  address: string;
  area: string;
  source: LeadSource;
  status: LeadStatus;
  reasonLost?: string;
  assignedPic: string;
  notes: string;
  createdAt: string;
  lastContacted: string;
  nextFollowUp?: string;
  estimatedKg: number;
  actualKg?: number;
  b2bProcessedKg?: number;
  pickupDate?: string;
  pickupStatus?: string;
  contractStatus?: string;
  potentialValue: number;
  dealValue?: number;
  finalValue?: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'customer' | 'agent';
  timestamp: string;
}

export interface Chat {
  id: string;
  contactName: string;
  contactPhone: string;
  lastMessage: string;
  lastTimestamp: string;
  unread: number;
  status: LeadStatus;
  leadId?: string;
  messages: ChatMessage[];
  assignedPic?: string;
}

export const statusLabels: Record<LeadStatus, string> = {
  new: 'New',
  not_followed_up: 'Not Followed Up',
  followed_up: 'Followed Up',
  in_progress: 'In Progress',
  picked_up: 'Picked Up',
  sign_contract: 'Sign Contract',
  completed: 'Completed / Deal',
  lost: 'Lost',
  cancelled: 'Cancelled',
};

export const statusColors: Record<LeadStatus, string> = {
  new: 'bg-info text-info-foreground',
  not_followed_up: 'bg-warning text-warning-foreground',
  followed_up: 'bg-secondary text-secondary-foreground',
  in_progress: 'bg-primary text-primary-foreground',
  picked_up: 'bg-accent text-accent-foreground',
  sign_contract: 'bg-primary text-primary-foreground',
  completed: 'bg-success text-success-foreground',
  lost: 'bg-destructive text-destructive-foreground',
  cancelled: 'bg-muted text-muted-foreground',
};

export const sourceLabels: Record<LeadSource, string> = {
  whatsapp: 'WhatsApp',
  web: 'Website',
  instagram: 'Instagram',
  referral: 'Referral',
  campaign: 'Campaign',
  partner: 'Partner',
  manual: 'Manual',
};

export const picList = ['Andi', 'Budi', 'Citra', 'Dewi', 'Eko'];

export const dummyLeads: Lead[] = [
  {
    id: 'L001', name: 'PT Hijau Lestari', phone: '628123456001', type: 'b2b', company: 'PT Hijau Lestari',
    address: 'Jl. Sudirman No.10', area: 'Jakarta Selatan', source: 'whatsapp', status: 'in_progress',
    assignedPic: 'Andi', notes: 'Interested in monthly pickup contract', createdAt: '2025-12-01',
    lastContacted: '2025-12-14', nextFollowUp: '2025-12-18', estimatedKg: 500, actualKg: 480,
    potentialValue: 15000000, dealValue: 14000000, pickupDate: '2025-12-16', pickupStatus: 'Scheduled',
  },
  {
    id: 'L002', name: 'Siti Nurhaliza', phone: '628123456002', type: 'b2c',
    address: 'Jl. Melati No.5', area: 'Bandung', source: 'instagram', status: 'new',
    assignedPic: 'Budi', notes: 'Has old laptops and phones', createdAt: '2025-12-10',
    lastContacted: '2025-12-10', estimatedKg: 8, potentialValue: 200000,
  },
  {
    id: 'L003', name: 'CV Maju Bersama', phone: '628123456003', type: 'b2b', company: 'CV Maju Bersama',
    address: 'Jl. Industri No.22', area: 'Surabaya', source: 'referral', status: 'picked_up',
    assignedPic: 'Citra', notes: 'Office equipment clearout', createdAt: '2025-11-20',
    lastContacted: '2025-12-12', estimatedKg: 200, actualKg: 215, potentialValue: 5000000,
    dealValue: 5500000, pickupDate: '2025-12-10', pickupStatus: 'Completed',
  },
  {
    id: 'L004', name: 'Rahmat Hidayat', phone: '628123456004', type: 'b2c',
    address: 'Jl. Anggrek No.12', area: 'Depok', source: 'web', status: 'completed',
    assignedPic: 'Dewi', notes: 'Recurring household pickup', createdAt: '2025-10-05',
    lastContacted: '2025-12-01', estimatedKg: 15, actualKg: 12,
    potentialValue: 400000, dealValue: 350000, finalValue: 350000,
    pickupDate: '2025-11-28', pickupStatus: 'Completed', contractStatus: 'Signed',
  },
  {
    id: 'L005', name: 'Lia Amelia', phone: '628123456005', type: 'b2c',
    address: 'Jl. Kenanga No.3', area: 'Bogor', source: 'campaign', status: 'lost',
    assignedPic: 'Eko', notes: 'Changed mind', reasonLost: 'Price too high', createdAt: '2025-11-15',
    lastContacted: '2025-11-20', estimatedKg: 5, potentialValue: 100000,
  },
  {
    id: 'L006', name: 'PT Teknologi Daur', phone: '628123456006', type: 'b2b', company: 'PT Teknologi Daur',
    address: 'Jl. Gatot Subroto No.45', area: 'Jakarta Pusat', source: 'partner', status: 'sign_contract',
    assignedPic: 'Andi', notes: 'Large data center decommission', createdAt: '2025-12-05',
    lastContacted: '2025-12-15', nextFollowUp: '2025-12-20', estimatedKg: 2000,
    potentialValue: 60000000, dealValue: 55000000, pickupDate: '2025-12-22', pickupStatus: 'Scheduled',
  },
  {
    id: 'L007', name: 'Agus Prasetyo', phone: '628123456007', type: 'b2c',
    address: 'Jl. Raya Cipete No.8', area: 'Jakarta Selatan', source: 'whatsapp', status: 'followed_up',
    assignedPic: 'Budi', notes: 'Old TV and fridge', createdAt: '2025-12-12',
    lastContacted: '2025-12-14', nextFollowUp: '2025-12-17', estimatedKg: 50, potentialValue: 800000,
  },
  {
    id: 'L008', name: 'Nina Kartika', phone: '628123456008', type: 'b2c',
    address: 'Jl. Bunga No.1', area: 'Tangerang', source: 'manual', status: 'not_followed_up',
    assignedPic: 'Citra', notes: 'Walk-in inquiry', createdAt: '2025-12-15',
    lastContacted: '2025-12-15', estimatedKg: 3, potentialValue: 75000,
  },
];

export const dummyChats: Chat[] = [
  {
    id: 'C001', contactName: 'PT Hijau Lestari', contactPhone: '628123456001',
    lastMessage: 'Kapan bisa dijadwalkan pickup?', lastTimestamp: '2025-12-15 14:30',
    unread: 2, status: 'in_progress', leadId: 'L001', assignedPic: 'Andi',
    messages: [
      { id: 'm1', text: 'Halo, kami ingin jadwalkan pickup e-waste dari kantor kami', sender: 'customer', timestamp: '2025-12-15 10:00' },
      { id: 'm2', text: 'Baik, terima kasih sudah menghubungi Remind! Bisa info estimasi berat dan jenis e-waste nya?', sender: 'agent', timestamp: '2025-12-15 10:05' },
      { id: 'm3', text: 'Sekitar 500 kg, mostly komputer lama dan monitor', sender: 'customer', timestamp: '2025-12-15 10:15' },
      { id: 'm4', text: 'Baik, kami akan siapkan jadwal pickup. Alamat lengkap sudah sesuai yang terdaftar?', sender: 'agent', timestamp: '2025-12-15 10:20' },
      { id: 'm5', text: 'Kapan bisa dijadwalkan pickup?', sender: 'customer', timestamp: '2025-12-15 14:30' },
    ],
  },
  {
    id: 'C002', contactName: 'Siti Nurhaliza', contactPhone: '628123456002',
    lastMessage: 'Saya ada laptop lama mau dibuang, gimana caranya?', lastTimestamp: '2025-12-15 11:20',
    unread: 1, status: 'new', leadId: 'L002',
    messages: [
      { id: 'm1', text: 'Saya ada laptop lama mau dibuang, gimana caranya?', sender: 'customer', timestamp: '2025-12-15 11:20' },
    ],
  },
  {
    id: 'C003', contactName: 'Agus Prasetyo', contactPhone: '628123456007',
    lastMessage: 'Oke saya tunggu jadwalnya ya', lastTimestamp: '2025-12-14 16:45',
    unread: 0, status: 'followed_up', leadId: 'L007', assignedPic: 'Budi',
    messages: [
      { id: 'm1', text: 'Halo saya mau buang TV dan kulkas lama', sender: 'customer', timestamp: '2025-12-12 09:00' },
      { id: 'm2', text: 'Halo Pak Agus! Terima kasih telah menghubungi Remind. Kami bisa bantu pickup. Bisa info alamat lengkap?', sender: 'agent', timestamp: '2025-12-12 09:10' },
      { id: 'm3', text: 'Jl. Raya Cipete No.8, Jakarta Selatan', sender: 'customer', timestamp: '2025-12-12 09:15' },
      { id: 'm4', text: 'Baik, kami akan jadwalkan pickup minggu depan. Nanti kami konfirmasi tanggal pastinya.', sender: 'agent', timestamp: '2025-12-14 16:40' },
      { id: 'm5', text: 'Oke saya tunggu jadwalnya ya', sender: 'customer', timestamp: '2025-12-14 16:45' },
    ],
  },
  {
    id: 'C004', contactName: 'PT Teknologi Daur', contactPhone: '628123456006',
    lastMessage: 'Kontraknya sudah kami review, siap tandatangan', lastTimestamp: '2025-12-15 09:00',
    unread: 3, status: 'sign_contract', leadId: 'L006', assignedPic: 'Andi',
    messages: [
      { id: 'm1', text: 'Selamat pagi, kami dari PT Teknologi Daur ingin diskusi soal decommission data center', sender: 'customer', timestamp: '2025-12-05 08:00' },
      { id: 'm2', text: 'Selamat pagi! Terima kasih sudah menghubungi Remind. Bisa jelaskan detail kebutuhannya?', sender: 'agent', timestamp: '2025-12-05 08:15' },
      { id: 'm3', text: 'Kami punya sekitar 2 ton peralatan server yang perlu dibuang secara proper', sender: 'customer', timestamp: '2025-12-05 08:30' },
      { id: 'm4', text: 'Kami kirimkan draft kontrak untuk review ya', sender: 'agent', timestamp: '2025-12-10 10:00' },
      { id: 'm5', text: 'Kontraknya sudah kami review, siap tandatangan', sender: 'customer', timestamp: '2025-12-15 09:00' },
    ],
  },
  {
    id: 'C005', contactName: 'Nina Kartika', contactPhone: '628123456008',
    lastMessage: 'Halo, saya mau tanya soal daur ulang elektronik', lastTimestamp: '2025-12-15 15:00',
    unread: 1, status: 'new',
    messages: [
      { id: 'm1', text: 'Halo, saya mau tanya soal daur ulang elektronik', sender: 'customer', timestamp: '2025-12-15 15:00' },
    ],
  },
];

export const quickReplies = [
  'Halo! Terima kasih sudah menghubungi Remind Indonesia 🌿 Ada yang bisa kami bantu?',
  'Baik, kami akan segera proses permintaan Anda.',
  'Bisa info alamat lengkap untuk penjemputan?',
  'Kami akan jadwalkan pickup dalam 2-3 hari kerja.',
  'Terima kasih! Pickup sudah dijadwalkan. Kami akan konfirmasi H-1.',
  'Apakah ada pertanyaan lain yang bisa kami bantu?',
];

export const kpiData = {
  totalLeads: 156,
  newLeads: 24,
  inProgress: 38,
  pickedUp: 52,
  deals: 31,
  lost: 11,
  totalKg: 12450,
  b2cKg: 3200,
  b2bKg: 9250,
  avgResponseTime: '12 min',
  avgCloseTime: '4.2 days',
  monthlyRevenue: 185000000,
  bestSource: 'WhatsApp',
  conversionRate: 42,
};
