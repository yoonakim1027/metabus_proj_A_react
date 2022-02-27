import { useApiAxios } from 'api/base';
import { useEffect, useState } from 'react';
import { useAuth } from 'contexts/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import LoadingIndicator from 'LoadingIndicator';

function InquiryDetail({ inquiryId }) {
  const navigate = useNavigate();
  const { auth } = useAuth();

  //method 지정을 안하면 -> get 요청이 default
  const [{ data: inquiry, loading, error }, refetch] = useApiAxios(
    `/inquiry_board/api/inquiry/${inquiryId}/`,
    { manual: true },
  );

  // gelete
  const [{}, deleteInquiry] = useApiAxios(
    {
      url: `/inquiry_board/api/inquiry/${inquiryId}/`,
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${auth.access}`,
      },
    },
    { manual: true },
  );

  const handleDelete = () => {
    if (window.confirm('정말 삭제 할까요?')) {
      deleteInquiry().then(() => {
        (auth.is_staff && navigate('/inquiry/')) ||
          (!auth.is_staff && navigate('/mypage/myinquiry/'));
      });
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  // 스크롤 기능
  const [scrollY, setScrollY] = useState(0);
  const gotoTop = () => {
    // 클릭하면 스크롤이 위로 올라가는 함수
    window.scrollTo({
      top: 1016,
      behavior: 'smooth',
    });
    setScrollY(0); // ScrollY 의 값을 초기화
  };

  // const handleFollow = () => {
  //   setScrollY(window.pageYOffset);
  // };

  // useEffect(() => {
  //   const watch = () => {
  //     window.addEventListener('scroll', handleFollow);
  //   };
  //   watch();
  //   return () => {
  //     window.removeEventListener('scroll', handleFollow);
  //   };
  // });
  // console.log('window Scroll From Top:', scrollY);

  useEffect(() => {
    gotoTop();
  }, [inquiry]);

  //-------------

  return (
    <>
      <div className="header flex flex-wrap justify-center">
        <div className="notice_header rounded-xl shadow-md overflow-hidden md:px-20 pt-5 pb-10 my-10  xl:w-2/3 lg:w-2/3 md:w-3/4 sm:w-w-full xs:w-full">
          <blockquote class="mt-5 text-6xl font-semibold italic text-center text-slate-900">
            <span class="mt-3 mb-10 before:block before:absolute before:-inset-1 before:-skew-y-3 before:bg-yellow-300 relative inline-block">
              <span class="relative text-white">" 1:1 문의 "</span>
            </span>
          </blockquote>
          {/* 로딩 에러 */}
          {loading && '로딩 중 ...'}
          {error && '로딩 중 에러가 발생했습니다.'}
          {error?.response?.status === 401 && (
            <div className="text-red-400">
              조회에 실패했습니다. 입력하신 정보를 다시 확인해주세요.
            </div>
          )}

          <div className="flex justify-center">
            <div className="px-4 py-5 w-2/3">
              {inquiry && (
                <>
                  <h1
                    className={
                      inquiry.title.length > 20
                        ? 'text-xl leading-6 font-bold text-gray-900 tracking-wide'
                        : 'text-3xl leading-6 font-bold text-gray-900 tracking-wide'
                    }
                  >
                    {inquiry.title}
                  </h1>
                  <hr className="mt-3 mb-3" />

                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-lg text-gray-500">
                    문의 내용
                  </h2>
                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-2xl text-gray-500">
                    {inquiry.content}
                  </h2>

                  <hr className="my-3 border border-gray-400" />

                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-lg text-gray-500">
                    답변
                  </h2>
                  <h2 className="sm:mt-0 sm:col-span-2 mt-2 mb-3 max-w-2xl text-2xl text-gray-500">
                    {inquiry.admin_answer}
                  </h2>
                </>
              )}
            </div>
          </div>
          <div>
            <div className="my-5 text-right">
              <div>
                {auth.is_staff ? (
                  <Link
                    to="/inquiry/"
                    className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  >
                    목록으로
                  </Link>
                ) : (
                  <Link
                    to="/mypage/myinquiry/"
                    className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  >
                    목록으로
                  </Link>
                )}

                {auth.isLoggedIn && auth.is_staff && (
                  <Link
                    to={`/admin/inquiry/${inquiryId}/edit/`}
                    className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
                  >
                    답변하기
                  </Link>
                )}
                {(auth.userID === inquiry?.user || auth.is_staff) && (
                  <button
                    onClick={() => handleDelete()}
                    className="ml-3 flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded mr-5"
                  >
                    삭제하기
                  </button>
                )}

                {/* 저장 에러  */}
                <div>
                  {loading && <LoadingIndicator>저장 중 ...</LoadingIndicator>}
                  {error &&
                    `저장 중 에러가 발생했습니다. (${error.response?.status} ${error.response?.statusText})`}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default InquiryDetail;
