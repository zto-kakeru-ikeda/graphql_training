import { ref, reactive, computed } from 'vue';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_USERS, CREATE_USER } from '../graphql/queries';

/**
 * ユーザー関連のビジネスロジックを管理するコンポーザブル
 * 
 * 責務:
 * - ユーザー一覧の取得と管理
 * - 新規ユーザーの作成
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
  // 公開API
  // ========================================
  return {
    // 一覧関連
    users,
    loading,
    error,
    refetch,

    // フォーム関連
    showForm,
    formData,
    toggleForm,
    resetForm,
    isFormValid,

    // ミューテーション関連
    createUser,
    creating,
    createError,
  };
}
