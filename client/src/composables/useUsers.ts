import { ref, reactive, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_USERS, CREATE_USER, UPDATE_USER } from '../graphql/queries';

/**
 * ユーザー関連のビジネスロジックを管理するコンポーザブル
 * 
 * 責務:
 * - ユーザー一覧の取得と管理
 * - 新規ユーザーの作成
 * - 既存ユーザーの編集
 * - フォームデータの状態管理
 * - エラーハンドリング
 */
export function useUsers() {
  // ========================================
  // ユーザー一覧取得
  // ========================================
  const { result, loading, error, refetch } = useQuery(GET_USERS);

  // ユーザー一覧を計算プロパティで取得（型安全性向上）
  const users = computed(() => result.value?.users || []);

  // ========================================
  // フォーム管理
  // ========================================
  const showForm = ref(false);

  const formData = reactive({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    avatar: '',
  });

  /**
   * フォームをリセット
   */
  const resetForm = () => {
    formData.username = '';
    formData.email = '';
    formData.fullName = '';
    formData.bio = '';
    formData.avatar = '';
  };

  /**
   * フォームの表示/非表示を切り替え
   */
  const toggleForm = () => {
    showForm.value = !showForm.value;
    if (!showForm.value) {
      resetForm();
    }
  };

  // ========================================
  // ユーザー作成
  // ========================================
  const { 
    mutate: createUserMutation, 
    loading: creating, 
    error: createError 
  } = useMutation(CREATE_USER);

  /**
   * 新規ユーザーを作成
   * @returns 成功した場合true、失敗した場合false
   */
  const createUser = async (): Promise<boolean> => {
    try {
      await createUserMutation({
        input: {
          username: formData.username,
          email: formData.email,
          fullName: formData.fullName,
          bio: formData.bio || undefined,
          avatar: formData.avatar || undefined,
        },
      });

      // 成功処理
      resetForm();
      showForm.value = false;
      await refetch();

      return true;
    } catch (err) {
      console.error('ユーザー作成エラー:', err);
      return false;
    }
  };

  // ========================================
  // フォームバリデーション（追加機能）
  // ========================================
  const isFormValid = computed(() => {
    return (
      formData.username.trim() !== '' &&
      formData.email.trim() !== '' &&
      formData.fullName.trim() !== ''
    );
  });

  // ========================================
  // ユーザー編集
  // ========================================
  const editingUserId = ref<string | null>(null);
  const editFormData = reactive({
    username: '',
    email: '',
    fullName: '',
    bio: '',
    avatar: '',
  });

  const { 
    mutate: updateUserMutation, 
    loading: updating, 
    error: updateError 
  } = useMutation(UPDATE_USER);

  /**
   * 編集モードを開始
   * @param user - 編集対象のユーザー
   */
  const startEditing = (user: any) => {
    editingUserId.value = user.id;
    editFormData.username = user.username;
    editFormData.email = user.email;
    editFormData.fullName = user.fullName;
    editFormData.bio = user.bio || '';
    editFormData.avatar = user.avatar || '';
  };

  /**
   * 編集モードをキャンセル
   */
  const cancelEditing = () => {
    editingUserId.value = null;
    editFormData.username = '';
    editFormData.email = '';
    editFormData.fullName = '';
    editFormData.bio = '';
    editFormData.avatar = '';
  };

  /**
   * ユーザー情報を更新
   * @returns 成功した場合true、失敗した場合false
   */
  const updateUser = async (): Promise<boolean> => {
    if (!editingUserId.value) return false;

    try {
      await updateUserMutation({
        id: editingUserId.value,
        input: {
          username: editFormData.username,
          email: editFormData.email,
          fullName: editFormData.fullName,
          bio: editFormData.bio || undefined,
          avatar: editFormData.avatar || undefined,
        },
      });

      // 成功処理
      cancelEditing();
      await refetch();

      return true;
    } catch (err) {
      console.error('ユーザー更新エラー:', err);
      return false;
    }
  };

  /**
   * 編集フォームのバリデーション
   */
  const isEditFormValid = computed(() => {
    return (
      editFormData.username.trim() !== '' &&
      editFormData.email.trim() !== '' &&
      editFormData.fullName.trim() !== ''
    );
  });

  /**
   * 指定されたユーザーが編集中かどうか
   */
  const isEditing = (userId: string) => {
    return editingUserId.value === userId;
  };

  // ========================================
  // 公開API
  // ========================================
  return {
    // 一覧関連
    users,
    loading,
    error,
    refetch,

    // フォーム関連（新規作成）
    showForm,
    formData,
    toggleForm,
    resetForm,
    isFormValid,

    // ミューテーション関連（新規作成）
    createUser,
    creating,
    createError,

    // 編集関連
    editingUserId,
    editFormData,
    startEditing,
    cancelEditing,
    updateUser,
    updating,
    updateError,
    isEditFormValid,
    isEditing,
  };
}
