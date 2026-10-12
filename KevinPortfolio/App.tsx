import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import type { ReactNode } from 'react';
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Tab = 'personal' | 'skills' | 'projects' | 'profile' | 'about';

type Project = {
  id: number;
  title: string;
  problem: string;
  contribution: string;
  technology: string;
};

const verificationCode = 'MOB-A2-25/27161';
const tabs: { id: Tab; short: string; label: string }[] = [
  { id: 'personal', short: 'H', label: 'Personal' },
  { id: 'skills', short: 'S', label: 'Skills' },
  { id: 'projects', short: 'P', label: 'Projects' },
  { id: 'profile', short: 'P', label: 'Profile' },
  { id: 'about', short: 'A', label: 'About' },
];

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Genuine student project 1',
    problem: 'Explain the genuine problem this project addressed.',
    contribution: 'Explain your personal contribution.',
    technology: 'Add the technology used.',
  },
  {
    id: 2,
    title: 'Genuine student project 2',
    problem: 'Explain the genuine problem this project addressed.',
    contribution: 'Explain your personal contribution.',
    technology: 'Add the technology used.',
  },
];

function Card({ children, style }: { children: ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

function PageTitle({ children }: { children: string }) {
  return <Text style={styles.pageTitle}>{children}</Text>;
}

function Field({
  label,
  value,
  onChangeText,
  multiline = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  multiline?: boolean;
}) {
  return (
    <View style={styles.field}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        accessibilityLabel={label}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        style={[styles.input, multiline && styles.multilineInput]}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );
}

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('personal');
  const [projects, setProjects] = useState(initialProjects);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [studentName, setStudentName] = useState('Uwiringiyimana Marie Claire');
  const [profileImageUri, setProfileImageUri] = useState<string | null>(null);
  const [imagePickerError, setImagePickerError] = useState('');
  const [aboutMe, setAboutMe] = useState(
    'I am a software engineering student who enjoys building useful mobile and web applications.',
  );
  const [primarySkill, setPrimarySkill] = useState(
    'Mobile app developer, full-stack web developer',
  );
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectProblem, setNewProjectProblem] = useState('');
  const [newProjectContribution, setNewProjectContribution] = useState('');
  const [newProjectTechnology, setNewProjectTechnology] = useState('');

  const pageTitles: Record<Tab, string> = {
    personal: 'Personal Profile',
    skills: 'Skills',
    projects: 'Projects',
    profile: 'Profile',
    about: 'About',
  };

  async function chooseProfileImage() {
    setImagePickerError('');
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });
      if (!result.canceled) {
        setProfileImageUri(result.assets[0].uri);
      }
    } catch (error) {
      setImagePickerError(
        error instanceof Error ? error.message : 'Could not open the image library.',
      );
    }
  }

  function addProject() {
    if (!newProjectTitle.trim()) {
      Alert.alert('Project title required', 'Enter a title before adding a project.');
      return;
    }

    const project = {
      id: editingProjectId ?? Date.now(),
      title: newProjectTitle.trim(),
      problem: newProjectProblem.trim() || 'Add the problem this project addressed.',
      contribution: newProjectContribution.trim() || 'Add your personal contribution.',
      technology: newProjectTechnology.trim() || 'Add the technology used.',
    };
    setProjects((current) =>
      editingProjectId === null
        ? [...current, project]
        : current.map((item) => (item.id === editingProjectId ? project : item)),
    );
    setEditingProjectId(null);
    setNewProjectTitle('');
    setNewProjectProblem('');
    setNewProjectContribution('');
    setNewProjectTechnology('');
    setShowProjectForm(false);
  }

  function renderPage() {
    switch (activeTab) {
      case 'personal':
        return (
          <>
            <Text style={styles.heroTitle}>My name is {studentName}.</Text>
            <View style={styles.intro}>
              {profileImageUri ? (
                <Image source={{ uri: profileImageUri }} style={styles.profilePhoto} />
              ) : (
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>MC</Text>
                </View>
              )}
              <View style={styles.introCopy}>
                <Text style={styles.role}>Aspiring software engineer</Text>
                <Text style={styles.availability}>Available</Text>
              </View>
            </View>
            <Card>
              <Text style={styles.cardTitle}>About me</Text>
              <Text style={styles.bodyText}>{aboutMe}</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Primary skill</Text>
              <Text style={styles.bodyText}>{primarySkill}</Text>
            </Card>
            <Text style={styles.verification}>Verification: {verificationCode}</Text>
          </>
        );
      case 'skills':
        return (
          <>
            <PageTitle>Skills &amp; education</PageTitle>
            <Card>
              <Text style={styles.cardTitle}>Skills</Text>
              {[
                'Mobile App Developer',
                'Full Stack Web Developer',
                'Video Editor',
                'Graphic Designer',
                'Add another skill',
              ].map((skill) => (
                <Text key={skill} style={styles.bullet}>
                  <Text style={styles.bulletDot}>• </Text>
                  {skill}
                </Text>
              ))}
            </Card>
            <Text style={styles.sectionTitle}>Education &amp; training</Text>
            {['Programme or course', 'Programme or course'].map((course, index) => (
              <Card key={`${course}-${index}`}>
                <Text style={styles.cardTitle}>{course}</Text>
                <Text style={styles.accentText}>Institution</Text>
                <Text style={styles.bodyText}>Add a short note about your training.</Text>
              </Card>
            ))}
          </>
        );
      case 'projects':
        return (
          <>
            <PageTitle>Student projects</PageTitle>
            <Pressable
              accessibilityRole="button"
              style={styles.primaryButton}
              onPress={() => setShowProjectForm((visible) => !visible)}
            >
              <Text style={styles.primaryButtonText}>
                {showProjectForm ? 'Cancel' : '+ Add project'}
              </Text>
            </Pressable>
            {showProjectForm && (
              <Card>
                <Text style={styles.cardTitle}>
                  {editingProjectId === null ? 'New project' : 'Edit project'}
                </Text>
                <Field
                  label="Project title"
                  value={newProjectTitle}
                  onChangeText={setNewProjectTitle}
                />
                <Field
                  label="Problem addressed"
                  value={newProjectProblem}
                  onChangeText={setNewProjectProblem}
                  multiline
                />
                <Field
                  label="My contribution"
                  value={newProjectContribution}
                  onChangeText={setNewProjectContribution}
                  multiline
                />
                <Field
                  label="Technology used"
                  value={newProjectTechnology}
                  onChangeText={setNewProjectTechnology}
                />
                <Pressable style={styles.primaryButton} onPress={addProject}>
                  <Text style={styles.primaryButtonText}>
                    {editingProjectId === null ? 'Save project' : 'Save changes'}
                  </Text>
                </Pressable>
              </Card>
            )}
            {projects.map((project) => (
              <Card key={project.id}>
                <Text style={styles.cardTitle}>{project.title}</Text>
                <Text style={styles.label}>Problem</Text>
                <Text style={styles.bodyText}>{project.problem}</Text>
                <Text style={styles.label}>My contribution</Text>
                <Text style={styles.bodyText}>{project.contribution}</Text>
                <Text style={styles.accentText}>{project.technology}</Text>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={styles.primaryButton}
                    onPress={() =>
                      setExpandedProject(expandedProject === project.id ? null : project.id)
                    }
                  >
                    <Text style={styles.primaryButtonText}>
                      {expandedProject === project.id ? 'Hide details' : 'View details'}
                    </Text>
                  </Pressable>
                  <Pressable
                    style={styles.outlineButton}
                    onPress={() => {
                      setEditingProjectId(project.id);
                      setNewProjectTitle(project.title);
                      setNewProjectProblem(project.problem);
                      setNewProjectContribution(project.contribution);
                      setNewProjectTechnology(project.technology);
                      setShowProjectForm(true);
                    }}
                  >
                    <Text style={styles.outlineButtonText}>Edit</Text>
                  </Pressable>
                </View>
                {expandedProject === project.id && (
                  <Text style={styles.expandedDetails}>
                    Contribution: {project.contribution}{'\n'}
                    Technology: {project.technology}
                  </Text>
                )}
              </Card>
            ))}
          </>
        );
      case 'profile':
        return (
          <>
            <PageTitle>Edit profile</PageTitle>
            <Card>
              <Text style={styles.fieldLabel}>Profile photo</Text>
              <View style={styles.profilePhotoRow}>
                {profileImageUri ? (
                  <Image source={{ uri: profileImageUri }} style={styles.profilePhoto} />
                ) : (
                  <View style={[styles.profilePhoto, styles.photoPlaceholder]}>
                    <Text style={styles.avatarText}>MC</Text>
                  </View>
                )}
                <View style={styles.photoActions}>
                  <Pressable style={styles.primaryButton} onPress={chooseProfileImage}>
                    <Text style={styles.primaryButtonText}>
                      {profileImageUri ? 'Change photo' : 'Choose photo'}
                    </Text>
                  </Pressable>
                  {profileImageUri && (
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => setProfileImageUri(null)}
                      style={styles.removePhotoButton}
                    >
                      <Text style={styles.removePhotoText}>Remove photo</Text>
                    </Pressable>
                  )}
                </View>
              </View>
              {imagePickerError ? <Text style={styles.errorText}>{imagePickerError}</Text> : null}
              <Field label="Full name" value={studentName} onChangeText={setStudentName} />
              <Field label="About me" value={aboutMe} onChangeText={setAboutMe} multiline />
              <Field
                label="Primary skill"
                value={primarySkill}
                onChangeText={setPrimarySkill}
                multiline
              />
              <Text style={styles.fieldLabel}>Registration number</Text>
              <Text style={styles.bodyText}>25/27161</Text>
              <Text style={styles.fieldLabel}>Verification code</Text>
              <Text style={styles.bodyText}>{verificationCode}</Text>
            </Card>
          </>
        );
      case 'about':
        return (
          <>
            <PageTitle>MC Portfolio</PageTitle>
            <Card>
              <Text style={styles.cardTitle}>Student</Text>
              <Text style={styles.bodyText}>{studentName.toLocaleUpperCase()}</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Registration number</Text>
              <Text style={styles.bodyText}>25/27161</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Verification code</Text>
              <Text style={styles.bodyText}>{verificationCode}</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Version</Text>
              <Text style={styles.bodyText}>1.0.0</Text>
            </Card>
            <Card>
              <Text style={styles.cardTitle}>Your data</Text>
              <Text style={styles.bodyText}>
                Profile edits and project details are stored only for this session. Your portfolio
                works without an internet connection.
              </Text>
            </Card>
          </>
        );
    }
  }

  return (
    <View style={styles.screen}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{pageTitles[activeTab]}</Text>
      </View>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        {renderPage()}
      </ScrollView>
      <View style={styles.tabBar}>
        {tabs.map((tab) => {
          const selected = activeTab === tab.id;
          return (
            <Pressable
              key={tab.id}
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              accessibilityLabel={tab.label}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tab}
            >
              <Text style={[styles.tabShort, selected && styles.selectedTabText]}>{tab.short}</Text>
              <Text
                numberOfLines={1}
                style={[styles.tabLabel, selected && styles.selectedTabText]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#f4f9f8' },
  header: {
    minHeight: 88,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 18,
    paddingTop: 24,
    backgroundColor: '#123d3b',
  },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: '700' },
  scroll: { flex: 1 },
  content: { width: '100%', maxWidth: 720, alignSelf: 'center', padding: 24, paddingBottom: 30 },
  pageTitle: { color: '#173d3b', fontSize: 30, fontWeight: '700', marginBottom: 20 },
  heroTitle: { color: '#173d3b', fontSize: 30, lineHeight: 39, fontWeight: '700', marginBottom: 20 },
  intro: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 20 },
  avatar: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#d7e8e5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: { color: '#0b7168', fontSize: 26, fontWeight: '700' },
  profilePhotoRow: { flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 18 },
  profilePhoto: { width: 88, height: 88, borderRadius: 44, backgroundColor: '#d7e8e5' },
  photoPlaceholder: { alignItems: 'center', justifyContent: 'center' },
  photoActions: { flex: 1, alignItems: 'flex-start' },
  removePhotoButton: { paddingVertical: 5 },
  removePhotoText: { color: '#a23434', fontSize: 14, fontWeight: '700' },
  errorText: { color: '#a23434', fontSize: 14, marginBottom: 12 },
  introCopy: { flex: 1 },
  role: { color: '#173d3b', fontSize: 20, fontWeight: '700', marginBottom: 6 },
  availability: { color: '#087a70', fontSize: 16, fontWeight: '700' },
  card: {
    backgroundColor: '#fff',
    borderColor: '#d8e2e0',
    borderWidth: 1,
    borderRadius: 20,
    padding: 22,
    marginBottom: 18,
  },
  cardTitle: { color: '#173d3b', fontSize: 20, fontWeight: '700', marginBottom: 10 },
  bodyText: { color: '#455653', fontSize: 16, lineHeight: 25, fontWeight: '600', marginBottom: 8 },
  sectionTitle: { color: '#173d3b', fontSize: 20, fontWeight: '700', marginBottom: 14 },
  bullet: { color: '#455653', fontSize: 16, lineHeight: 35, fontWeight: '600' },
  bulletDot: { color: '#087a70', fontWeight: '700' },
  label: { color: '#173d3b', fontSize: 15, fontWeight: '700', marginTop: 2, marginBottom: 7 },
  accentText: { color: '#087a70', fontSize: 15, lineHeight: 23, fontWeight: '700', marginBottom: 8 },
  verification: { color: '#667773', fontSize: 14, fontWeight: '700', textAlign: 'center', marginTop: 4 },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#087a70',
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButtonText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#087a70',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  outlineButtonText: { color: '#087a70', fontSize: 15, fontWeight: '700' },
  buttonRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 3 },
  expandedDetails: { color: '#455653', fontSize: 15, lineHeight: 24, borderTopWidth: 1, borderColor: '#e4ebea', paddingTop: 12 },
  field: { marginBottom: 14 },
  fieldLabel: { color: '#173d3b', fontSize: 15, fontWeight: '700', marginBottom: 7 },
  input: {
    borderColor: '#d8e2e0',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#344541',
    fontSize: 15,
    backgroundColor: '#fff',
  },
  multilineInput: { minHeight: 82 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#123d3b',
    paddingTop: 10,
    paddingBottom: 14,
    paddingHorizontal: 4,
  },
  tab: { flex: 1, minWidth: 0, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 2 },
  tabShort: { color: '#d7e2e0', fontSize: 17, fontWeight: '700', marginBottom: 3 },
  tabLabel: { color: '#d7e2e0', fontSize: 11, fontWeight: '600' },
  selectedTabText: { color: '#73d6c5' },
});
